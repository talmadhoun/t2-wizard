# 🇨🇦 T2 & T5 Filing Wizard for Simple Canadian Corporations

A sleek, modern, browser-based wizard to prepare your **T2 Corporate Tax Return** and **T5 Dividend Slips** — tailored for small business owners who want control, clarity, and CRA-compliant results.

---

## 🧾 What It Does

- ✅ Guides you step-by-step through **T2 return preparation**
- ✅ Supports **T5 slip generation** for dividend-paying corporations
- ✅ Handles schedules: 1, 3, 4, 5, 7, 8, 9, 23, 50, GIFI 100/125/141
- ✅ Automatically maps entries to CRA form lines (e.g., Line 061 – Tax Year End)
- ✅ Calculates gross-up amounts and dividend tax credits
- ✅ Provides a **real-time T5 preview**
- ✅ Auto-saves form data in browser (using `localStorage`)
- ✅ Highlights missing or conditionally required schedules
- ✅ Prepares everything you need to **manually input into FutureTax**

---

## ✅ Best Suited For

This wizard is ideal for Canadian-Controlled Private Corporations (CCPCs) with:

- No employees or payroll obligations
- No foreign income, assets, or subsidiaries
- No investment income or capital gains
- No partnerships or intercompany relationships
- One shareholder (you!)

---

## ❌ Not For

- Complex corporate structures
- Firms with employees or multiple shareholders
- Electronic CRA T2 filing via XML or NetFile
- Accountants managing dozens of clients

---

## ⚠️ Disclaimer

This tool **does not submit your tax return** to the CRA.

It helps you **prepare and organize** your tax data for input into **FutureTax**, **GenuTax**, or **other CRA-certified software**.

Use at your own risk. Always double-check your entries and consult a tax professional if unsure.

---

## 🚀 Tech Stack

- ⚛️ React 18
- 🎨 TailwindCSS (Stripe/Linear-inspired styles)
- 🧠 Conditional rendering with real-time validation
- 💾 `localStorage` for persistent auto-save

---

## 🛠️ Setup Instructions

### Local Development

```bash
git clone https://github.com/your-username/t2-t5-filing-wizard.git
cd t2-t5-filing-wizard
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

### One-Click Deployment

Deploy to:

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [Cloudflare Pages](https://pages.cloudflare.com)

---

## 📷 Screenshots

Coming soon — or submit your own!

---

## 🙏 Acknowledgements

Made with ❤️ to simplify small business tax prep in Canada.
Inspired by years of frustration.

> Built by Canadians. For Canadians.
