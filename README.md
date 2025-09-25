# 🚀

**Kiosco Interactivo** it is _powered by_ the following technologies:

📱 **Mobile application**. `TypeScript` with `React Native (Expo)`.

⚙️ **Backend**. `C#` for API's creation and database connection.

🗄️ **Database**. `SQL Server` as database engine.

## Commits

To make a proper commit; The structure of the message must be like following:

```bash
 git commit -m "type - Body of the message."
```

The **type** of commit messages are:

- 00 - temp (to save a quick copy)
- 01 - feature
- 02 - fix
- 03 - refactor
- 04 - test
- 05 - fix-refactor (two or more actions)

### Commit examples

✅

```bash
git commit -m "01 - Screen x has been... "
```

❌

```bash
git commit -m "feature: Screen x has been..."
```

## Error handling

```ts
enum TYPE_ALERT_ERROR {
  ERR_APP, // 00
  ERR_SERVER, // 01
  ERR_SERVICE, // 02
}
```
