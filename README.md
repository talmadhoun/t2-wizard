Here's the README file in markdown format:

# 🇨🇦 T2 & T5 Filing Wizard for Simple Canadian Corporations

A sleek, modern, browser-based wizard to prepare your **T2 Corporate Tax Return** and **T5 Dividend Slips** — tailored for small business owners who want control, clarity, and CRA-compliant results.

**🔗 Live Demo:** 


[https://t2-wizard.pages.dev/](https://t2-wizard.pages.dev/)

[https://t2-wizard.vercel.app/](https://t2-wizard.vercel.app/)

---

## 🧾 What It Does

- ✅ Guides you step-by-step through **T2 return preparation**
- ✅ Supports **T5 slip generation** for dividend-paying corporations
- ✅ Collects all required information for schedules: 1, 3, 8, 50, 100, 125, 141, and more
- ✅ Captures GIFI data for Balance Sheet and Income Statement reporting
- ✅ Automatically maps entries to CRA form lines (e.g., Line 061 – Tax Year End)
- ✅ Calculates gross-up amounts and dividend tax credits per CRA formulas
- ✅ Provides a **real-time T5 preview** with all required boxes
- ✅ Auto-saves form data in browser (using `localStorage`)
- ✅ Comprehensive Capital Cost Allowance (CCA) management
- ✅ Highlights missing or conditionally required schedules
- ✅ Prepares everything you need to **manually input into FutureTax T2**

---

## ✅ Best Suited For

This wizard is ideal for Canadian-Controlled Private Corporations (CCPCs) with:

- No employees or payroll obligations
- No foreign income, assets, or subsidiaries
- No investment income or capital gains
- No partnerships or intercompany relationships
- One shareholder (you!)
- Single permanent establishment (typically in one province)

---

## ❌ Not For

- Complex corporate structures
- Firms with employees or multiple shareholders
- Electronic CRA T2 filing via XML or NetFile
- Accountants managing dozens of clients
- Corporations with complex tax situations

---

## ⚠️ Disclaimer

This tool **does not submit your tax return** to the CRA.

It helps you **prepare and organize** your tax data for input into **FutureTax T2** or **other CRA-certified software**.

# 🧾 Recommended T2 Corporate Tax Filing Software (Canada)

A comparison of CRA-certified software for filing T2 corporate tax returns in Canada — ideal for small businesses, solo owners, and multi-year filings (2021–2024).

| Name             | Cost (CAD)                               | Supports Multi-Year | CRA Certified | Internet Filing | User-Friendliness | Website                              |
|------------------|------------------------------------------|---------------------|---------------|-----------------|-------------------|--------------------------------------|
| **FutureTax T2** | $59.99 (1 return), $99.99 (5 returns)    | ✅ Yes              | ✅ Yes        | ✅ Yes          | ✅ High           | [futuretax.ca/t2](https://www.futuretax.ca/t2/) |
| **UFile T2**     | $186.95 per return (2024 price)          | ✅ Yes              | ✅ Yes        | ✅ Yes          | ✅ Very High      | [ufile.ca](https://www.ufile.ca/products/ufilet2) |
| **Gofile**       | $999.00 per year-end filing              | ✅ Yes              | ✅ Yes        | ✅ Yes          | ✅ Very High      | [gofile.ca](https://www.gofile.ca/) |
| **TaxTron T2**   | ~$70/year                                | ✅ Yes              | ✅ Yes        | ✅ Yes          | 🟡 Moderate       | [taxtron.ca](https://www.taxtron.ca/) |
| **ProFile T2**   | $310 (1 return)                          | ✅ Yes              | ✅ Yes        | ✅ Yes          | ❌ Low (pro only) | [intuit.com/ca/products/profile](https://www.intuit.com/ca/products/profile/) |
| **Taxprep**      | $1,086 (Lite, 10 returns) to $2,385+     | ✅ Yes              | ✅ Yes        | ✅ Yes          | ❌ Low (pro only) | [taxprep.com](https://www.taxprep.com/) |


> ✅ Best overall for most small businesses: **FutureTax T2**
> 🧠 Easiest online platform alternative: **UFile T2** or **Gofile**


Use at your own risk. Always double-check your entries and consult a tax professional if unsure.

---

## 🚀 Tech Stack

- ⚛️ React 18
- 🎨 TailwindCSS (Stripe/Linear-inspired styles)
- 🧠 Conditional rendering with real-time validation
- 💾 `localStorage` for persistent auto-save
- 📱 Responsive design for desktop and mobile
- 🔄 Interactive components for complex data entry (CCA schedule, address fields, etc.)

---

## 💡 Key Features

- **Data Persistence:** All your inputs are automatically saved in your browser
- **Step-by-Step Guidance:** Clear instructions for each form field
- **Real-time Validation:** Ensures required fields are completed
- **CRA Line Mapping:** Connects each input to official CRA line numbers
- **Conditional Logic:** Only shows relevant fields based on your situation
- **T5 Slip Preview:** Shows exactly how your T5 slips will look
- **Schedule Recognition:** Identifies which schedules you need to file

---

## 🛠️ Setup Instructions

### Local Development

```bash
git clone https://github.com/your-username/t2-t5-filing-wizard.git
cd t2-t5-filing-wizard
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser

### One-Click Deployment

Deploy to:

- [Vercel](https://vercel.com): Best for React applications
- [Netlify](https://netlify.com): Great for static sites with form capabilities
- [Cloudflare Pages](https://pages.cloudflare.com): Excellent for high performance and security

The project is currently deployed on Cloudflare Pages at [https://t2-wizard.pages.dev/](https://t2-wizard.pages.dev/)

---

## 🔒 Privacy & Security

- **No Server Storage:** All data stays in your browser's local storage
- **No Data Transmission:** Your tax information never leaves your device
- **Offline Capable:** Can be used without an internet connection once loaded
- **Clear Data Anytime:** Reset button allows you to clear all saved information

---

## 📷 Screenshots

Coming soon — or submit your own!

---

## 🙏 Acknowledgements

Made with ❤️ by Thaer Almadhoun (talmadhoun@gmail.com) to simplify small business tax prep in Canada.
Inspired by years of frustration with complex tax software.

> Built by Canadians. For Canadians.
