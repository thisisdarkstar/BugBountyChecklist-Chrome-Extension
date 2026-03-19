# BountyChecklist

A powerful Chrome extension for bug bounty hunters providing quick access to 1000+ vulnerability payloads and techniques via a convenient sidebar panel.

![BountyChecklist](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Sidebar Panel** - Access payloads without leaving your current tab
- **1000+ Payloads** - Comprehensive SQL injection payloads and more
- **38 Vulnerability Categories** - Covering OWASP Top 10 and beyond
- **Light/Dark Theme** - Easy on the eyes for extended hunting sessions
- **Font Size Options** - Small, Medium, Large for better readability
- **Fuzzy Search** - Quick payload/technique lookup
- **Copy to Clipboard** - One-click copy for any payload
- **Favorites** - Save your go-to payloads for quick access
- **Responsive Design** - Works seamlessly in any panel width

## Supported Categories

- SQL Injection (1488+ payloads)
- XSS (Cross-Site Scripting)
- Command Injection
- SSRF (Server-Side Request Forgery)
- XXE (XML External Entity)
- OAuth Vulnerabilities
- GraphQL Security
- WebSocket Security
- HTTP Request Smuggling
- Prototype Pollution
- SSTI (Server-Side Template Injection)
- Subdomain Takeover
- Race Conditions
- 2FA Bypass Techniques
- And 25+ more...

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `BountyChecklist` folder
6. The extension icon will appear in your toolbar

### From Chrome Web Store

*(Coming soon)*

## Usage

### Opening the Sidebar

- Click the extension icon in your toolbar
- Or use the keyboard shortcut: `Ctrl+Shift+B` (Mac: `Command+Shift+B`)

### Quick Actions

- **Headers** - Common HTTP headers for testing
- **Favorites** - View your saved payloads
- **Random** - Get a random payload for inspiration

### Search

Use the search bar to find specific payloads or techniques across all categories.

### Copying Payloads

Click on any payload to copy it to your clipboard instantly.

### Font Size

Adjust text size using the S/M/L buttons in the header for comfortable reading.

### Theme Toggle

Switch between light and dark themes using the sun/moon icon.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+B` | Toggle sidebar |
| `Ctrl+K` | Focus search |

## Permissions

| Permission | Purpose |
|------------|---------|
| `storage` | Save preferences (theme, favorites, font size) |
| `tabs` | Required for sidebar functionality |
| `sidePanel` | Chrome side panel API |
| `activeTab` | Access current tab context |

## File Structure

```
BountyChecklist/
├── manifest.json           # Extension manifest
├── background/
│   └── background.js       # Service worker
├── popup/
│   ├── popup.html         # Popup UI
│   ├── popup.css          # Popup styles
│   └── popup.js           # Popup logic
├── sidebar/
│   ├── sidebar.html       # Sidebar UI
│   ├── sidebar.css        # Sidebar styles
│   └── sidebar.js         # Sidebar logic
└── assets/
    ├── data/
    │   └── vulnerabilities.json  # Payload database
    └── icons/             # Extension icons
```

## Screenshots

*(Add screenshots here)*

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use, modify, and distribute.

## Disclaimer

This tool is intended for legitimate security testing and educational purposes only. Always obtain proper authorization before testing any target. The developers are not responsible for any misuse of this tool.

---

**Happy Hunting! 🐛**
