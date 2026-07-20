# 集成记录：企业微信 + Hermes + Qoder + NetSuite

> 沉淀日期：2026-07-19
> 作者：徐中杰（zhongjie.xu）
> 目的：把"手机企微发一句话 → 真实调度 Qoder 拉 NetSuite 数据 → 结果回手机"的完整搭建过程和踩坑全记下来，方便重装或交接。

---

## 0. 最终成果（一句话）

在企业微信里创建一个 AI Bot，通过 Hermes Gateway 的长连接接收消息，由 Hermes 作为"调度中枢"调用本机的 `qodercli`（Qoder Agent），再由 Qoder 通过 NetSuite MCP 拉取真实财务/子公司数据，结果回传到手机企微。

**已验证可用的端到端链路：**
`企微 App 发消息` → `Hermes Gateway (WebSocket)` → `Hermes Agent (tencent/hy3:free)` → `qodercli -p` → `NetSuite MCP (@suiteinsider/netsuite-mcp)` → 真实数据 → 回传企微。

实测指令示例（已成功）：
- "请使用qoder拉去netsuite的子公司" → 49 秒后返回 919 字（含 29 家子公司列表）。

---

## 1. 架构总览

```
[手机 企业微信]
      │  (AI Bot 长连接 WebSocket, 无需公网/域名)
      ▼
[Hermes Gateway]  ── 常驻进程, 登录 Windows 自启
      │  (消息路由 + 权限策略 + agent 调度)
      ▼
[Hermes Agent]  ── 模型: tencent/hy3:free (nous)
      │
      ├── 直接: 终端/文件/浏览器/代码执行
      │
      └── 调度: qodercli (子进程, -p 非交互模式)
                    │
                    ▼
            [NetSuite MCP server]
            (@suiteinsider/netsuite-mcp, stdio)
                    │  (OAuth, 账号 9911232)
                    ▼
            [NetSuite 生产环境]  上海健耕医药科技股份有限公司
```

**涉及的 4 套异构系统：**
1. 企业微信 AI Bot —— WebSocket 长连接 + aibot 订阅认证
2. Hermes Gateway —— 消息路由 + agent 调度 + 权限策略引擎
3. Qoder CLI (`qodercli`) —— 子进程, 自带模型/OAuth/企业上下文
4. NetSuite MCP —— stdio 协议本地 server, 桥接 NetSuite OAuth

---

## 2. 前置条件

| 项目 | 要求 | 备注 |
|------|------|------|
| 企业微信组织账号 | 需有管理员权限或能让管理员建 AI Bot | 个人微信不行, 必须企业微信 |
| AI Bot 应用 | 在企微后台建好, 连接方式选"长连接" | 后台显示 Bot ID + Secret |
| 本机 Hermes | 已安装 (`hermes` 命令可用) | 运行于 Windows + bash 终端 |
| Python 依赖 | `aiohttp` + `httpx` + `cryptography` | 必须装进 Hermes 自带的 venv |
| Qoder CLI | `qodercli` 已安装且已登录 | 路径: `C:/Users/zhongjie.xu/.qoder/bin/qodercli/` |
| NetSuite MCP | 已配好 `netsuite` server 且 Connected | 见第 4 节 |

---

## 3. 企业微信接入（WeCom）

### 3.1 后台建 Bot（在企微管理后台操作）
- 应用 → 创建应用 → **AI Bot**
- 连接方式选 **"使用长连接"**（即 WebSocket, 无需域名/IP）
- 勾选"使用自有系统获取成员与机器人的聊天并输出回复"
- 设置"可见范围"为**仅自己**（或后续指定的同事）
- 复制 **Bot ID** 和 **Secret**（Secret 需点"获取"按钮）

实测 Bot ID：`aib9i_ZgVxUQjCsLKQKgA1dKzBFVFyHFca1`

### 3.2 配置文件 `~/.hermes/.env`
> 路径: `C:/Users/zhongjie.xu/AppData/Local/hermes/.env`

```dotenv
# ===== WeCom (Enterprise WeChat) AI Bot =====
WECOM_BOT_ID=aib9i_ZgVxUQjCsLKQKgA1dKzBFVFyHFca1
WECOM_SECRET=<你后台获取的 Secret, 43 位>
WECOM_DM_POLICY=allowlist
WECOM_GROUP_POLICY=allowlist
WECOM_ALLOWED_USERS=zhongjie.xu
```

> ⚠️ **关键坑**：`WECOM_DM_POLICY` 必须写成 `allowlist`（配合 `WECOM_ALLOWED_USERS`），
> **不能写 `open`**。写 `open` + 没开 `WECOM_ALLOW_ALL_USERS` 会触发安全护栏，gateway 直接拒绝启动。

企微 userid 获取方式：企微后台 → 成员管理 → 对应成员的"账号"字段（本机实测 userid = `zhongjie.xu`）。

### 3.3 安装 Python 依赖（必须装进 Hermes 的 venv）
```bash
# Hermes 自带的 venv python 路径:
VENV_PY="C:/Users/zhongjie.xu/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe"
"$VENV_PY" -m pip install aiohttp httpx cryptography
# 验证:
"$VENV_PY" -c "import aiohttp, httpx, cryptography; print('OK')"
```

### 3.4 启动 / 安装为自启
```bash
# 前台测试（看连接日志）:
hermes gateway

# 安装为 Windows 登录自启（回退方案: Startup 文件夹, 非系统服务）:
hermes gateway install --start-on-login --start-now
```
- 安装时若未弹 UAC 管理员确认，会回退到 **Startup 文件夹**方案
  （`C:/Users/zhongjie.xu/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/Hermes_Gateway.vbs`）
- 效果：**每次登录 Windows 自动起 gateway**，企微 Bot 即可收消息
- 本机实测 gateway PID 常驻运行中

### 3.5 验证连接
```bash
hermes gateway status          # 应显示 "Gateway process running (PID: xxxx)"
tail -f "$LOCALAPPDATA/hermes/logs/gateway.log"
# 关键日志:
#   [Wecom] Connected to wss://openws.work.weixin.qq.com
#   ✓ wecom connected
#   Gateway running with 1 platform(s)
#   Channel directory built: 1 target(s)   <-- 1 表示你的 userid 已被识别为授权目标
```

---

## 4. NetSuite MCP（已在 Qoder 侧配好）

Qoder 侧已配置且连接正常，**无需再动**：
```bash
qodercli mcp list
# Configured MCP servers:
# ✓ netsuite: cmd /c npx -y @suiteinsider/netsuite-mcp@latest (stdio) - Connected
```
- 类型: stdio
- 账号: `NETSUITE_ACCOUNT_ID=9911232`（上海健耕医药科技股份有限公司）
- 认证: OAuth（token 有效）
- 可用工具（节选）: `ns_getSubsidiaries`, `ns_listAllReports`, `ns_runReport`, `ns_runCustomSuiteQL`, `ns_getRecord` 等 16 个

**已知权限限制（实测）:**
- 当前 Qoder 角色**无 `customer` 记录的 SuiteQL 权限**（查 customer 报 "Record not found"）
- 可用: `Vendor`, `transaction` 等
- 只读查询在非交互模式需加 `--dangerously-skip-permissions`，否则报
  "Permission confirmation required but no interactive handler is available."

---

## 5. 调度 Qoder（核心用法）

### 5.1 通过 Hermes 调用 qodercli
在企微里直接发自然语言指令即可，Hermes 会转成 `qodercli -p` 调用。例如：
- "请使用qoder拉去netsuite的子公司"
- "让 qoder 从 NetSuite 拉最新利润表填进 netsuite_pl_dashboard.html"

### 5.2 命令形态（Hermes 在后台执行）
```bash
cd "D:/ClaudeProject/TransnovoAI"
qodercli --dangerously-skip-permissions -p "你已连接 netsuite MCP。严格只做只读操作... 调用 ns_getSubsidiaries 返回子公司列表..."
```
- `-p / --print`：非交互模式，执行完打印结果退出
- `--dangerously-skip-permissions`：跳过交互式权限确认（**定时任务/企微自动调度必须加**，因无人点击允许）

### 5.3 实测数据样例（NetSuite 子公司，节选）
母公司 / 上海健耕医药科技股份有限公司 / 上海云泽生物科技有限公司 /
广东健耕药业有限公司 / 湖南健耕医疗器械有限公司 / 各地分公司 / 合并&抵消公司 等共 29 家。

---

## 6. 踩坑清单（按发生顺序）

| # | 现象 | 根因 | 解决 |
|---|------|------|------|
| 1 | `aiohttp not installed` 启动报错 | Hermes venv 缺依赖 | 装 `aiohttp httpx cryptography` 到 venv |
| 2 | `Refusing to start: wecom open policy without allow-all opt-in` | `dm_policy=open` 但没开 allow-all 开关，触发安全护栏 | 加 `WECOM_ALLOW_ALL_USERS=true`（临时测通） |
| 3 | 改 allowlist 后 gateway **进程退出、消息收不到** | 误把 `dm_policy` 写成 `open` + 配 `WECOM_ALLOWED_USERS`，组合非法被拒 | 改 `WECOM_DM_POLICY=allowlist`（正确白名单模式） |
| 4 | 企微发消息"像没回" | qoder 调用本身要 ~1 分钟，且 WeCom 不流式、整段回复 | 耐心等 49 秒左右；日志 `response ready` 即已发出 |
| 5 | `TERMINAL_CWD` deprecated 警告 | 旧 .env 写法，无害 | 可移至 `config.yaml` 的 `terminal.cwd`（未处理，不影响功能） |

**最致命的是 #3**：配置改错 → gateway 静默退出 → 之后所有消息丢失且无提示。排查靠 `hermes gateway status` + 看 `gateway.log` 末行。

---

## 7. 运维 & 排错速查

```bash
# 进程是否活着
hermes gateway status

# 看实时日志（收消息/调度/连接都在这）
tail -f "$LOCALAPPDATA/hermes/logs/gateway.log"

# 重启 gateway（改 .env 后必须重启才生效）
# 先结束旧进程, 再:
hermes gateway                       # 前台
# 或
hermes gateway install --start-on-login --start-now   # 重新装自启

# 确认企微通道目标数 (=1 表示你的账号被授权)
grep "Channel directory built" "$LOCALAPPDATA/hermes/logs/gateway.log" | tail -1
```

**日志关键信号：**
- `inbound message: ... user=zhongjie.xu msg='...'` → 消息已收到
- `response ready: ... time=Xs response=Y chars` → agent 已生成回复
- `[Wecom] Sending response (Y chars) to zhongjie.xu` → 已发回企微
- `Refusing to start` / `ERROR` → 启动被拒，检查 .env 策略组合

---

## 8. 安全与权限说明

- **当前策略**：`allowlist` + 仅 `zhongjie.xu` 可驱动。他人（含同事）消息被忽略。
- **绝对不要**设 `WECOM_ALLOW_ALL_USERS=true` + `dm_policy=open` 长期运行——
  那等于"任何能找到 Bot 的人都能用你的电脑跑命令、调 Qoder、花你额度"。
- 如需放开给同事：用 `WECOM_ALLOWED_USERS=zhongjie.xu,同事A的userid`（精确白名单），不要退回全开。
- `.env` 含 `WECOM_SECRET`，属敏感凭据，**不要提交到 git / 发给他人**。
- Qoder 调用默认只读；写 NetSuite（create/update）需额外谨慎，本集成未启用写操作。

---

## 9. 待办 / 可扩展

- [ ] 消掉 `TERMINAL_CWD` deprecated 警告（移至 config.yaml）
- [ ] 升级为真正的 Windows 系统服务（需 UAC 管理员授权，`hermes gateway install --system`）
- [ ] 用 cron 定时（如每天 9 点）拉 NetSuite 利润表存本地 JSON，投递到企微
- [ ] 如需团队共用：建企微群 + 配置 `group_policy` + 群白名单
- [ ] （不推荐）代表本人自动回复同事私聊：需自建企微应用 + 消息回调，复杂且有合规风险

---

## 10. 一句话定性

- 开发复杂度：低（使用者未写一行代码）
- 集成复杂度：中（4 套异构系统拼装，排错靠耐心）
- 架构深度：浅（本质是消息转发 + 子进程调用，无自研协议）
- 难点在"接线和排错"，不在"技术原理深"
