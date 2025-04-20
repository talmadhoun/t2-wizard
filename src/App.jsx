import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, HelpCircle, Check, AlertTriangle, BookOpen, Briefcase, Home, FileText, Calculator, DollarSign, CheckCircle, PieChart, User, Calendar, Hash, FileSpreadsheet, RefreshCw, Building, Archive, Percent, Wrench, Plus, Trash } from 'lucide-react';

// Main Wizard Component
const T2Wizard = () => {
  // State Management
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [formComplete, setFormComplete] = useState(false);
  const [fieldMapping, setFieldMapping] = useState([]);
  const [t5SlipPreview, setT5SlipPreview] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: '',
    position: { x: 0, y: 0 }
  });
  const [showResetModal, setShowResetModal] = useState(false);
  const [ccaItems, setCcaItems] = useState([]);
  
  // Format a date consistently, preserving the exact date without timezone shifts
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // For HTML date inputs (YYYY-MM-DD format)
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-').map(part => parseInt(part, 10));
      // Return in MM/DD/YYYY format
      return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
    }
    
    // If already in MM/DD/YYYY format, return as is
    if (dateString.includes('/')) {
      return dateString;
    }
    
    // For other date formats, handle without timezone issues
    try {
      // Split the date string by parts to avoid timezone conversion
      const dateParts = new Date(dateString).toISOString().split('T')[0].split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const day = parseInt(dateParts[2]);
      
      // Return in MM/DD/YYYY format
      return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString; // Return original if parsing fails
    }
  };
  
  // Load saved form data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('t2WizardFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        
        // If there's saved data, also update the T5 preview if applicable
        if (parsedData.t5Required === true) {
          updateT5SlipPreview(parsedData);
        }
        
        // Load saved CCA items if available
        if (parsedData.ccaItems) {
          setCcaItems(parsedData.ccaItems);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);
  
  // Define the sections for color coding and progress tracking
  const sections = [
    { id: 'identification', name: 'Corporation Identification', icon: <Briefcase size={18} />, color: '#3b82f6' },
    { id: 'address', name: 'Address Information', icon: <Home size={18} />, color: '#14b8a6' },
    { id: 'status', name: 'Corporate Status', icon: <FileText size={18} />, color: '#f97316' },
    { id: 'financial', name: 'Financial Information', icon: <DollarSign size={18} />, color: '#22c55e' },
    { id: 'shareholders', name: 'Shareholder Information', icon: <User size={18} />, color: '#8b5cf6' },
    { id: 'gifi', name: 'GIFI Financial Data', icon: <FileSpreadsheet size={18} />, color: '#64748b' },
    { id: 'schedule1', name: 'Schedule 1 Items', icon: <BookOpen size={18} />, color: '#0ea5e9' },
    { id: 'cca', name: 'CCA Deductions', icon: <Wrench size={18} />, color: '#f59e0b' },
    { id: 't5', name: 'T5 Slip Information', icon: <FileSpreadsheet size={18} />, color: '#0ea5e9' },
    { id: 'certification', name: 'Certification', icon: <CheckCircle size={18} />, color: '#6366f1' }
  ];
  
  // Questions and conditional logic
  const steps = [
    // Start with required core steps without conditions
    {
      id: 'corporationName',
      section: 'identification',
      title: 'Corporation Name',
      question: 'What is the full legal name of your corporation?',
      fieldType: 'text',
      tooltip: 'Enter the complete legal name as it appears on your incorporation documents.',
      formLine: 'T2 - Line 001 - Corporation name',
      required: true
    },
    {
      id: 'businessNumber',
      section: 'identification',
      title: 'Business Number',
      question: 'What is your corporation\'s 9-digit business number?',
      fieldType: 'text',
      placeholder: '123456789',
      tooltip: 'Enter your 9-digit business number assigned by the CRA.',
      formLine: 'T2 - Line 002 - Business number',
      required: true
    },
    {
      id: 'corporationType',
      section: 'identification',
      title: 'Corporation Type',
      question: 'What type of corporation is filing this return?',
      fieldType: 'select',
      options: [
        { value: 'ccpc', label: 'Canadian-Controlled Private Corporation (CCPC)' },
        { value: 'other-private', label: 'Other Private Corporation' },
        { value: 'public', label: 'Public Corporation' },
        { value: 'other', label: 'Other Corporation Type' }
      ],
      tooltip: 'Select the type of corporation as classified by the Income Tax Act.',
      formLine: 'T2 - Line 040 - Type of corporation',
      required: true
    },
    {
      id: 'taxYearStart',
      section: 'identification',
      title: 'Tax Year Start',
      question: 'What is the start date of this tax year?',
      fieldType: 'date',
      tooltip: 'Enter the first day of the current tax year.',
      formLine: 'T2 - Line 060 - Tax year start',
      required: true
    },
    {
      id: 'taxYearEnd',
      section: 'identification',
      title: 'Tax Year End',
      question: 'What is the end date of this tax year?',
      fieldType: 'date',
      tooltip: 'Enter the last day of the current tax year.',
      formLine: 'T2 - Line 061 - Tax year end',
      required: true
    },
    {
      id: 'isFirstYearFiling',
      section: 'status',
      title: 'First Year Filing',
      question: 'Is this the first year filing a T2 return for this corporation?',
      fieldType: 'radio',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      tooltip: 'Select "Yes" if this is the first T2 return being filed since incorporation.',
      formLine: 'T2 - Line 070 - Is this the first year of filing after incorporation?',
      required: true
    },
    {
      id: 'isFirstYearAfterAmalgamation',
      section: 'status',
      title: 'First Year After Amalgamation',
      question: 'Is this the first year filing a T2 return after an amalgamation?',
      fieldType: 'radio',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      tooltip: 'Select "Yes" if this is the first T2 return being filed after an amalgamation.',
      formLine: 'T2 - Line 071 - Is this the first year of filing after amalgamation?',
      required: true
    },
    {
      id: 'jurisdictionOfIncorporation',
      section: 'status',
      title: 'Jurisdiction of Incorporation',
      question: 'In which jurisdiction is your corporation incorporated?',
      fieldType: 'select',
      options: [
        { value: 'federal', label: 'Federal (Canada)' },
        { value: 'ab', label: 'Alberta' },
        { value: 'bc', label: 'British Columbia' },
        { value: 'mb', label: 'Manitoba' },
        { value: 'nb', label: 'New Brunswick' },
        { value: 'nl', label: 'Newfoundland and Labrador' },
        { value: 'ns', label: 'Nova Scotia' },
        { value: 'nt', label: 'Northwest Territories' },
        { value: 'nu', label: 'Nunavut' },
        { value: 'on', label: 'Ontario' },
        { value: 'pe', label: 'Prince Edward Island' },
        { value: 'qc', label: 'Quebec' },
        { value: 'sk', label: 'Saskatchewan' },
        { value: 'yt', label: 'Yukon' },
        { value: 'foreign', label: 'Foreign Jurisdiction' }
      ],
      tooltip: 'Select the jurisdiction where your corporation was legally incorporated.',
      formLine: 'T2 - Schedule 200 - Jurisdiction',
      required: true
    },
    {
      id: 'dateOfIncorporation',
      section: 'status',
      title: 'Date of Incorporation',
      question: 'When was your corporation incorporated?',
      fieldType: 'date',
      tooltip: 'Enter the date when your corporation was legally formed and registered.',
      formLine: 'T2 - Schedule 200 - Date of incorporation',
      required: true
    },
    {
      id: 'corporateAddress',
      section: 'address',
      title: 'Corporate Address',
      question: 'What is the main business address of your corporation?',
      fieldType: 'compositeAddress',
      tooltip: 'Enter the physical address where your corporation conducts its main business activities.',
      formLine: 'T2 - Lines 010-015 - Corporate address',
      required: true
    },
    {
      id: 'mailingAddress',
      section: 'address',
      title: 'Mailing Address',
      question: 'Is your mailing address different from your business address?',
      fieldType: 'radio',
      options: [
        { value: true, label: 'Yes, we have a different mailing address' },
        { value: false, label: 'No, use the same address for mail' }
      ],
      tooltip: 'Indicate if your corporation uses a different address for receiving mail.',
      formLine: 'T2 - Line 016 - Mailing address indicator',
      required: true
    },
    {
      id: 'booksAndRecordsAddress',
      section: 'address',
      title: 'Location of Books and Records',
      question: 'Where are the books and records of your corporation kept?',
      fieldType: 'compositeAddress',
      tooltip: 'Enter the address where your corporation maintains its financial records and books.',
      formLine: 'T2 - Lines 030-038 - Location of books and records',
      required: true
    },
    {
      id: 'provinceOfPermanentEstablishment',
      section: 'address',
      title: 'Province of Permanent Establishment',
      question: 'In which province(s) does your corporation have a permanent establishment?',
      fieldType: 'checkboxes',
      options: [
        { id: 'AB', label: 'Alberta' },
        { id: 'BC', label: 'British Columbia' },
        { id: 'MB', label: 'Manitoba' },
        { id: 'NB', label: 'New Brunswick' },
        { id: 'NL', label: 'Newfoundland and Labrador' },
        { id: 'NS', label: 'Nova Scotia' },
        { id: 'NT', label: 'Northwest Territories' },
        { id: 'NU', label: 'Nunavut' },
        { id: 'ON', label: 'Ontario' },
        { id: 'PE', label: 'Prince Edward Island' },
        { id: 'QC', label: 'Quebec' },
        { id: 'SK', label: 'Saskatchewan' },
        { id: 'YT', label: 'Yukon' }
      ],
      tooltip: 'Select all provinces and territories where your corporation has a permanent establishment. A permanent establishment is generally a fixed place of business.',
      formLine: 'T2 - Schedule 5 - Provinces/territories of permanent establishments',
      required: true,
      defaultValue: ['ON'] // Default to Ontario
    },
    {
      id: 'shareholderFirstName',
      section: 'shareholders',
      title: 'Shareholder First Name',
      question: 'What is the first name of the shareholder?',
      fieldType: 'text',
      tooltip: 'Enter the first name of the shareholder.',
      formLine: 'T2 - Schedule 50 - Shareholder first name',
      required: true
    },
    {
      id: 'shareholderLastName',
      section: 'shareholders',
      title: 'Shareholder Last Name',
      question: 'What is the last name of the shareholder?',
      fieldType: 'text',
      tooltip: 'Enter the last name of the shareholder.',
      formLine: 'T2 - Schedule 50 - Shareholder last name',
      required: true
    },
    {
      id: 'shareholderSIN',
      section: 'shareholders',
      title: 'Shareholder SIN',
      question: 'What is the Social Insurance Number (SIN) of the shareholder?',
      fieldType: 'text',
      placeholder: '123-456-789',
      tooltip: 'Enter the shareholder\'s 9-digit SIN. This is required for Schedule 50.',
      formLine: 'T2 - Schedule 50 - SIN/Business Number/Trust Number',
      required: true,
      validation: (value) => /^\d{9}$|^\d{3}-\d{3}-\d{3}$/.test(value),
      validationMessage: 'SIN must be in the format 123-456-789 or 123456789.'
    },
    {
      id: 'shareholderAddress',
      section: 'shareholders',
      title: 'Shareholder Address',
      question: 'What is the address of the shareholder?',
      fieldType: 'compositeAddress',
      tooltip: 'Enter the complete mailing address of the shareholder.',
      formLine: 'T2 - Schedule 50 - Shareholder address',
      required: true
    },
    {
      id: 'shareClass',
      section: 'shareholders',
      title: 'Share Class',
      question: 'What class of shares does the shareholder hold?',
      fieldType: 'text',
      placeholder: 'Common',
      tooltip: 'Enter the class of shares held by the shareholder (e.g., Common, Class A, Preferred, etc.).',
      formLine: 'T2 - Schedule 50 - Share class',
      required: true
    },
    {
      id: 'numberOfShares',
      section: 'shareholders',
      title: 'Number of Shares',
      question: 'How many shares does the shareholder hold?',
      fieldType: 'number',
      tooltip: 'Enter the number of shares held by the shareholder.',
      formLine: 'T2 - Schedule 50 - Number of shares',
      required: true
    },
    {
      id: 'percentageVotingRights',
      section: 'shareholders',
      title: 'Percentage of Voting Rights',
      question: 'What percentage of voting rights does the shareholder have?',
      fieldType: 'number',
      tooltip: 'Enter the percentage of voting rights held by the shareholder.',
      formLine: 'T2 - Schedule 50 - % of voting rights',
      defaultValue: '100',
      required: true
    },
    // GIFI Financial Data Section
    {
      id: 'netIncomePerFinancialStatements',
      section: 'gifi',
      title: 'Net Income per Financial Statements',
      question: 'What is the net income (or loss) according to your financial statements?',
      fieldType: 'currency',
      tooltip: 'Enter the net income or loss amount from your financial statements before tax adjustments. This is the starting point for Schedule 1.',
      formLine: 'T2 - Schedule 1 - Line 9999 - Net income (loss) per financial statements',
      required: true
    },
    {
      id: 'financialStatementType',
      section: 'gifi',
      title: 'Financial Statement Type',
      question: 'What type of financial statements did you prepare?',
      fieldType: 'select',
      options: [
        { value: '1', label: 'Formal financial statements' },
        { value: '2', label: 'Combined formal financial statements' },
        { value: '3', label: 'Income statement information only' },
        { value: '4', label: 'Income statement information and balance sheet' }
      ],
      tooltip: 'Select the type of financial statements that were prepared for the corporation.',
      formLine: 'T2 - Schedule 141 - Line 280 - Type of financial statements',
      required: true
    },
    {
      id: 'financialStatementsPreparer',
      section: 'gifi',
      title: 'Financial Statements Preparer',
      question: 'Who prepared the financial statements?',
      fieldType: 'select',
      options: [
        { value: '1', label: 'Accountant' },
        { value: '2', label: 'Individual (self-prepared)' },
        { value: '3', label: 'Corporation (self-prepared)' },
        { value: '4', label: 'Bookkeeper' },
        { value: '5', label: 'Public accountant' }
      ],
      tooltip: 'Indicate who prepared the financial statements for the corporation.',
      formLine: 'T2 - Schedule 141 - Line 290 - Who prepared this return?',
      required: true
    },
    {
      id: 'levelOfAssurance',
      section: 'gifi',
      title: 'Level of Assurance',
      question: 'What level of assurance is associated with the financial statements?',
      fieldType: 'select',
      options: [
        { value: '1', label: 'Audit' },
        { value: '2', label: 'Review' },
        { value: '3', label: 'Compilation/Notice to reader' },
        { value: '4', label: 'Other' }
      ],
      tooltip: 'Select the level of assurance provided with the financial statements.',
      formLine: 'T2 - Schedule 141 - Line 278 - Level of assurance',
      required: true
    },
    // GIFI Balance Sheet Items (Schedule 100)
    {
      id: 'cashGIFI',
      section: 'gifi',
      title: 'Cash and Deposits (GIFI 1001)',
      question: 'What is the amount of cash and deposits at year-end?',
      fieldType: 'currency',
      tooltip: 'Enter the total value of cash, bank accounts, and short-term deposits at the end of the fiscal year.',
      formLine: 'T2 - Schedule 100 - GIFI 1001 - Cash and deposits',
      required: false
    },
    {
      id: 'accountsReceivableGIFI',
      section: 'gifi',
      title: 'Accounts Receivable (GIFI 1060)',
      question: 'What is the amount of accounts receivable at year-end?',
      fieldType: 'currency',
      tooltip: 'Enter the total value of trade accounts receivable at the end of the fiscal year.',
      formLine: 'T2 - Schedule 100 - GIFI 1060 - Accounts receivable',
      required: false
    },
    {
      id: 'inventoryGIFI',
      section: 'gifi',
      title: 'Inventory (GIFI 1120)',
      question: 'What is the value of inventory at year-end?',
      fieldType: 'currency',
      tooltip: 'Enter the total value of inventory at the end of the fiscal year.',
      formLine: 'T2 - Schedule 100 - GIFI 1120 - Inventory',
      required: false
    },
    {
      id: 'prepaidExpensesGIFI',
      section: 'gifi',
      title: 'Prepaid Expenses (GIFI 1480)',
      question: 'What is the amount of prepaid expenses at year-end?',
      fieldType: 'currency',
      tooltip: 'Enter the total value of prepaid expenses at the end of the fiscal year.',
      formLine: 'T2 - Schedule 100 - GIFI 1480 - Prepaid expenses',
      required: false
    },
    {
      id: 'capitalAssetsGIFI',
      section: 'gifi',
      title: 'Capital Assets (GIFI 2008)',
      question: 'What is the net book value of capital assets at year-end?',
      fieldType: 'currency',
      tooltip: 'Enter the total net book value (cost less accumulated amortization) of capital assets at the end of the fiscal year.',
      formLine: 'T2 - Schedule 100 - GIFI 2008 - Capital assets',
      required: false
    },
    {
      id: 'accountsPayableGIFI',
      section: 'gifi',
      title: 'Accounts Payable (GIFI 2620)',
      question: 'What is the amount of accounts payable at year-end?',
      fieldType: 'currency',
      tooltip: 'Enter the total value of trade accounts payable at the end of the fiscal year.',
      formLine: 'T2 - Schedule 100 - GIFI 2620 - Accounts payable and accrued liabilities',
      required: false
    },
    {
      id: 'dueToShareholdersGIFI',
      section: 'gifi',
      title: 'Due to Shareholders (GIFI 2780)',
      question: 'What is the amount due to shareholders at year-end?',
      fieldType: 'currency',
      tooltip: 'Enter any loans, advances, or amounts owing to shareholders at the end of the fiscal year.',
      formLine: 'T2 - Schedule 100 - GIFI 2780 - Due to shareholders and directors',
      required: false
    },
    {
      id: 'commonSharesGIFI',
      section: 'gifi',
      title: 'Common Shares (GIFI 3500)',
      question: 'What is the value of common shares issued?',
      fieldType: 'currency',
      tooltip: 'Enter the value of common shares issued and outstanding.',
      formLine: 'T2 - Schedule 100 - GIFI 3500 - Common shares',
      required: false
    },
    {
      id: 'retainedEarningsGIFI',
      section: 'gifi',
      title: 'Retained Earnings (GIFI 3850)',
      question: 'What is the balance of retained earnings at year-end?',
      fieldType: 'currency',
      tooltip: 'Enter the balance of retained earnings at the end of the fiscal year.',
      formLine: 'T2 - Schedule 100 - GIFI 3850 - Retained earnings/deficit',
      required: false
    },
    // GIFI Income Statement Items (Schedule 125)
    {
      id: 'salesRevenueGIFI',
      section: 'gifi',
      title: 'Sales Revenue (GIFI 8000)',
      question: 'What is the total sales revenue for the year?',
      fieldType: 'currency',
      tooltip: 'Enter the total sales revenue for the fiscal year.',
      formLine: 'T2 - Schedule 125 - GIFI 8000 - Sales of goods and services',
      required: false
    },
    {
      id: 'costOfSalesGIFI',
      section: 'gifi',
      title: 'Cost of Sales (GIFI 8300)',
      question: 'What is the total cost of sales for the year?',
      fieldType: 'currency',
      tooltip: 'Enter the total cost of sales for the fiscal year.',
      formLine: 'T2 - Schedule 125 - GIFI 8300 - Cost of sales',
      required: false
    },
    {
      id: 'wagesExpenseGIFI',
      section: 'gifi',
      title: 'Salaries and Wages (GIFI 9060)',
      question: 'What is the total expense for salaries and wages?',
      fieldType: 'currency',
      tooltip: 'Enter the total expense for salaries and wages for the fiscal year.',
      formLine: 'T2 - Schedule 125 - GIFI 9060 - Salaries and wages',
      required: false
    },
    {
      id: 'rentExpenseGIFI',
      section: 'gifi',
      title: 'Rent Expense (GIFI 8910)',
      question: 'What is the total rent expense for the year?',
      fieldType: 'currency',
      tooltip: 'Enter the total rent expense for the fiscal year.',
      formLine: 'T2 - Schedule 125 - GIFI 8910 - Rent',
      required: false
    },
    {
      id: 'interestExpenseGIFI',
      section: 'gifi',
      title: 'Interest Expense (GIFI 8710)',
      question: 'What is the total interest expense for the year?',
      fieldType: 'currency',
      tooltip: 'Enter the total interest expense for the fiscal year.',
      formLine: 'T2 - Schedule 125 - GIFI 8710 - Interest and bank charges',
      required: false
    },
    {
      id: 'amortizationExpenseGIFI',
      section: 'gifi',
      title: 'Amortization Expense (GIFI 8670)',
      question: 'What is the total amortization/depreciation expense for the year?',
      fieldType: 'currency',
      tooltip: 'Enter the total amortization/depreciation expense recorded in your financial statements for the fiscal year.',
      formLine: 'T2 - Schedule 125 - GIFI 8670 - Amortization and depreciation',
      required: false
    },
    {
      id: 'officeExpenseGIFI',
      section: 'gifi',
      title: 'Office Expenses (GIFI 8810)',
      question: 'What is the total office expense for the year?',
      fieldType: 'currency',
      tooltip: 'Enter the total office expenses for the fiscal year.',
      formLine: 'T2 - Schedule 125 - GIFI 8810 - Office expenses',
      required: false
    },
    {
      id: 'professionalFeesGIFI',
      section: 'gifi',
      title: 'Professional Fees (GIFI 8860)',
      question: 'What is the total professional fee expense for the year?',
      fieldType: 'currency',
      tooltip: 'Enter the total professional fees (legal, accounting, etc.) for the fiscal year.',
      formLine: 'T2 - Schedule 125 - GIFI 8860 - Professional fees',
      required: false
    },
    {
      id: 'mealsEntertainmentGIFI',
      section: 'gifi',
      title: 'Meals and Entertainment (GIFI 8523)',
      question: 'What is the total meals and entertainment expense for the year?',
      fieldType: 'currency',
      tooltip: 'Enter the total meals and entertainment expense before the 50% limitation for the fiscal year.',
      formLine: 'T2 - Schedule 125 - GIFI 8523 - Meals and entertainment',
      required: false
    },
    // Schedule 1 Reconciliation Items
    {
      id: 'amortizationAddback',
      section: 'schedule1',
      title: 'Amortization/Depreciation Add-back',
      question: 'What is the amount of accounting amortization/depreciation to add back?',
      fieldType: 'currency',
      tooltip: 'Enter the amount of accounting amortization/depreciation expense that needs to be added back. This should match your GIFI 8670 amount.',
      formLine: 'T2 - Schedule 1 - Line 104 - Amortization/depreciation',
      required: false
    },
    {
      id: 'mealsEntertainmentAddback',
      section: 'schedule1',
      title: 'Meals & Entertainment 50% Add-back',
      question: 'What is the 50% non-deductible portion of meals and entertainment expenses?',
      fieldType: 'currency',
      tooltip: 'Enter 50% of your total meals and entertainment expenses, which is non-deductible for tax purposes.',
      formLine: 'T2 - Schedule 1 - Line 116 - Meals and entertainment expenses',
      required: false
    },
    {
      id: 'politicalContributions',
      section: 'schedule1',
      title: 'Political Contributions',
      question: 'What is the amount of political contributions made during the year?',
      fieldType: 'currency',
      tooltip: 'Enter the amount of political contributions made by the corporation during the fiscal year. These are not deductible for tax purposes.',
      formLine: 'T2 - Schedule 1 - Line 119 - Political contributions',
      required: false
    },
    {
      id: 'otherNonDeductibleExpenses',
      section: 'schedule1',
      title: 'Other Non-Deductible Expenses',
      question: 'What is the amount of other non-deductible expenses?',
      fieldType: 'currency',
      tooltip: 'Enter the total of other expenses that are not deductible for tax purposes (e.g., fines, penalties, club dues, etc.).',
      formLine: 'T2 - Schedule 1 - Line 126 - Other additions',
      required: false
    },
    {
      id: 'ccaDeduction',
      section: 'schedule1',
      title: 'CCA Deduction',
      question: 'What is the Capital Cost Allowance (CCA) deduction for the year?',
      fieldType: 'currency',
      tooltip: 'Enter the total CCA claim for the fiscal year from Schedule 8. If you have entered CCA data in the CCA section, this will be calculated for you.',
      formLine: 'T2 - Schedule 1 - Line 215 - Capital cost allowance',
      required: false
    },
    {
      id: 'otherDeductions',
      section: 'schedule1',
      title: 'Other Deductions',
      question: 'What is the amount of other deductions?',
      fieldType: 'currency',
      tooltip: 'Enter the total of other deductions for tax purposes not reported elsewhere.',
      formLine: 'T2 - Schedule 1 - Line 226 - Other deductions',
      required: false
    },
    // CCA Section (Schedule 8)
    {
      id: 'hasCCAAssets',
      section: 'cca',
      title: 'Depreciable Assets',
      question: 'Does the corporation own depreciable assets?',
      fieldType: 'radio',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      tooltip: 'Select "Yes" if your corporation owns depreciable property that qualifies for Capital Cost Allowance (CCA).',
      formLine: 'T2 - Schedule 8 - CCA assets indicator',
      required: true
    },
    {
      id: 'ccaSchedule',
      section: 'cca',
      title: 'Capital Cost Allowance (CCA) Information',
      question: 'Enter information about your depreciable assets',
      fieldType: 'ccaSchedule',
      tooltip: 'Add details for each class of depreciable assets owned by the corporation.',
      formLine: 'T2 - Schedule 8 - CCA schedule',
      required: false,
      condition: (data) => data.hasCCAAssets === true
    },
    // Financial and T5 section from original code
    {
      id: 'eligibleDividendsPaid',
      section: 'financial',
      title: 'Eligible Dividends',
      question: 'Did the corporation pay eligible dividends during the tax year?',
      fieldType: 'radio',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      tooltip: 'Eligible dividends receive preferential tax treatment for shareholders. Select "Yes" if your corporation paid eligible dividends during this tax year.',
      formLine: 'T2 - Schedule 3 - Part I - Eligible Dividends',
      required: true
    },
    {
      id: 'eligibleDividendsPaidAmount',
      section: 'financial',
      title: 'Eligible Dividends Amount',
      question: 'What is the total amount of eligible dividends paid?',
      fieldType: 'currency',
      tooltip: 'Enter the total dollar amount of eligible dividends paid to shareholders during the tax year.',
      formLine: 'T2 - Schedule 3 - Part I - Line 310',
      required: true,
      condition: (data) => data.eligibleDividendsPaid === true
    },
    {
      id: 'nonEligibleDividendsPaid',
      section: 'financial',
      title: 'Non-Eligible Dividends',
      question: 'Did the corporation pay non-eligible dividends during the tax year?',
      fieldType: 'radio',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      tooltip: 'Non-eligible dividends are subject to higher tax rates for shareholders. Select "Yes" if your corporation paid non-eligible dividends during this tax year.',
      formLine: 'T2 - Schedule 3 - Part I - Non-Eligible Dividends',
      required: true
    },
    {
      id: 'nonEligibleDividendsPaidAmount',
      section: 'financial',
      title: 'Non-Eligible Dividends Amount',
      question: 'What is the total amount of non-eligible dividends paid?',
      fieldType: 'currency',
      tooltip: 'Enter the total dollar amount of non-eligible dividends paid to shareholders during the tax year.',
      formLine: 'T2 - Schedule 3 - Part I - Line 320',
      required: true,
      condition: (data) => data.nonEligibleDividendsPaid === true
    },
    // T5 Section
    {
      id: 't5Required',
      section: 't5',
      title: 'T5 Slip Generation',
      question: 'Do you need to generate T5 slips for dividend payments?',
      fieldType: 'radio',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      tooltip: 'If the corporation paid dividends to shareholders during the tax year, you need to issue T5 slips to report these payments.',
      formLine: 'T5 Slip Requirement',
      required: true,
      condition: (data) => data.eligibleDividendsPaid === true || data.nonEligibleDividendsPaid === true
    },
    {
      id: 't5Year',
      section: 't5',
      title: 'Calendar Year for T5',
      question: 'For which calendar year are these T5 slips being filed?',
      fieldType: 'number',
      placeholder: new Date().getFullYear().toString(),
      tooltip: 'Enter the calendar year (not fiscal year) for which these T5 slips are being filed. This is typically the calendar year in which the fiscal year-end falls.',
      formLine: 'T5 Box - Year',
      required: true,
      condition: (data) => data.t5Required === true
    },
    {
      id: 't5RecipientName',
      section: 't5',
      title: 'Recipient Name',
      question: 'What is the full legal name of the dividend recipient?',
      fieldType: 'text',
      tooltip: 'Enter the recipient\'s full legal name, last name first (e.g., "Smith, John A.").',
      formLine: 'T5 - Recipient\'s name',
      required: true,
      condition: (data) => data.t5Required === true
    },
    {
      id: 't5RecipientAddress',
      section: 't5',
      title: 'Recipient Address',
      question: 'What is the complete mailing address of the dividend recipient?',
      fieldType: 'compositeAddress',
      tooltip: 'Enter the complete mailing address where the T5 slip should be sent. All address fields are required for proper T5 filing.',
      formLine: 'T5 - Recipient\'s address',
      required: true,
      condition: (data) => data.t5Required === true
    },
    {
      id: 't5SIN',
      section: 't5',
      title: 'Social Insurance Number',
      question: 'What is the recipient\'s Social Insurance Number (SIN)?',
      fieldType: 'text',
      placeholder: '123-456-789',
      tooltip: 'Enter the recipient\'s 9-digit SIN without dashes. This is required for T5 reporting.',
      formLine: 'T5 Box 22 - Recipient identification number',
      required: true,
      condition: (data) => data.t5Required === true,
      validation: (value) => /^\d{9}$|^\d{3}-\d{3}-\d{3}$/.test(value),
      validationMessage: 'SIN must be in the format 123-456-789 or 123456789.'
    },
    {
      id: 't5RecipientType',
      section: 't5',
      title: 'Recipient Type',
      question: 'What type of recipient is this?',
      fieldType: 'select',
      options: [
        { value: '1', label: 'Individual' },
        { value: '2', label: 'Joint Account' },
        { value: '3', label: 'Corporation' },
        { value: '4', label: 'Association/Trust/Club/Partnership' },
        { value: '5', label: 'Government' }
      ],
      tooltip: 'Select the type of recipient. For individuals, select "1 - Individual".',
      formLine: 'T5 Box 23 - Recipient type',
      required: true,
      defaultValue: '1',  // Default to individual since you're the sole shareholder
      condition: (data) => data.t5Required === true
    },
    {
      id: 't5PaymentDate',
      section: 't5',
      title: 'Dividend Payment Date',
      question: 'On what date were the dividends paid or payable?',
      fieldType: 'date',
      tooltip: 'Enter the date when the dividends were paid to the shareholder or declared payable. This date is required for T5 slip reporting.',
      formLine: 'T5 - Date dividends paid',
      required: true,
      condition: (data) => data.t5Required === true
    },
    {
      id: 't5ReportCode',
      section: 't5',
      title: 'Report Code',
      question: 'What is the report code for this T5 slip?',
      fieldType: 'select',
      options: [
        { value: 'O', label: 'Original (O)' },
        { value: 'A', label: 'Amended (A)' },
        { value: 'C', label: 'Cancelled (C)' }
      ],
      tooltip: 'Select the report code. Use "O" for original T5 filings.',
      formLine: 'T5 Box 21 - Report code',
      required: true,
      defaultValue: 'O',  // Default to Original for first filing
      condition: (data) => data.t5Required === true
    },
    {
      id: 't5PayerName',
      section: 't5',
      title: 'Payer Name and Address',
      question: 'What is the corporation\'s full legal name and address for the T5 slip?',
      fieldType: 'compositeCompanyAddress',
      tooltip: 'Enter the complete legal name and mailing address of the corporation as it should appear on the T5 slip.',
      formLine: 'T5 - Payer\'s name and address',
      required: true,
      condition: (data) => data.t5Required === true
    },
    {
      id: 't5PreviewSlip',
      section: 't5',
      title: 'T5 Slip Preview',
      question: 'Review your T5 slip information',
      fieldType: 'reviewT5',
      tooltip: 'Review the information that will be used to generate the T5 slip. The taxable amounts and dividend tax credits are calculated automatically based on CRA formulas.',
      formLine: 'T5 Slip Preview',
      required: false,
      condition: (data) => data.t5Required === true
    },
    // Add a certification step as the final step
    {
      id: 'certification',
      section: 'certification',
      title: 'Review and Certify',
      question: 'Please review the information and certify it is correct',
      fieldType: 'review',
      tooltip: 'Review all the information before submitting your T2 return.',
      formLine: 'T2 - Certification',
      required: true
    }
  ];
  
  // Completely simplified company address field to fix the focus issues
  const CompositeCompanyAddressField = ({ id, value, onChange }) => {
    // Direct implementation with normal form handling
    const handleNameChange = (e) => {
      if (onChange) {
        onChange({
          ...value,
          [`${id}_name`]: e.target.value
        });
      }
    };
    
    const handleStreetChange = (e) => {
      if (onChange) {
        onChange({
          ...value,
          [`${id}_street`]: e.target.value
        });
      }
    };
    
    const handleCityChange = (e) => {
      if (onChange) {
        onChange({
          ...value,
          [`${id}_city`]: e.target.value
        });
      }
    };
    
    const handleProvinceChange = (e) => {
      if (onChange) {
        onChange({
          ...value,
          [`${id}_province`]: e.target.value
        });
      }
    };
    
    const handlePostalCodeChange = (e) => {
      if (onChange) {
        onChange({
          ...value,
          [`${id}_postalCode`]: e.target.value
        });
      }
    };
    
    return (
      <div className="space-y-3">
        <input 
          type="text" 
          value={formData[`${id}_name`] || ''}
          onChange={handleNameChange}
          placeholder="Company Name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input 
          type="text" 
          value={formData[`${id}_street`] || ''}
          onChange={handleStreetChange}
          placeholder="Street Address"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="text" 
            value={formData[`${id}_city`] || ''}
            onChange={handleCityChange}
            placeholder="City"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input 
            type="text" 
            value={formData[`${id}_province`] || ''}
            onChange={handleProvinceChange}
            placeholder="Province/Territory"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <input 
          type="text" 
          value={formData[`${id}_postalCode`] || ''}
          onChange={handlePostalCodeChange}
          placeholder="Postal Code"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
  };
  
  // CCA Schedule Component
  const CCAScheduleField = ({ id, onChange }) => {
    // Function to add a new CCA item
    const addCCAItem = () => {
      const newItem = {
        id: `cca-${Date.now()}`,
        classNumber: '',
        description: '',
        undepreciatedCapitalCost: '',
        additions: '',
        dispositions: '',
        adjustments: '',
        rate: ''
      };
      
      const updatedItems = [...ccaItems, newItem];
      setCcaItems(updatedItems);
      
      // Update form data with CCA items
      if (onChange) {
        onChange(updatedItems);
      }
    };
    
    // Function to remove a CCA item
    const removeCCAItem = (itemId) => {
      const updatedItems = ccaItems.filter(item => item.id !== itemId);
      setCcaItems(updatedItems);
      
      // Update form data with CCA items
      if (onChange) {
        onChange(updatedItems);
      }
    };
    
    // Function to update a CCA item field
    const updateCCAItem = (itemId, field, value) => {
      const updatedItems = ccaItems.map(item => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      });
      
      setCcaItems(updatedItems);
      
      // Update form data with CCA items
      if (onChange) {
        onChange(updatedItems);
      }
    };
    
    // Common CCA classes with their rates
    const ccaClasses = [
      { value: '1', label: 'Class 1 - 4%', rate: '4' },
      { value: '8', label: 'Class 8 - 20%', rate: '20' },
      { value: '10', label: 'Class 10 - 30%', rate: '30' },
      { value: '12', label: 'Class 12 - 100%', rate: '100' },
      { value: '13', label: 'Class 13 - Original lease period', rate: 'SL' },
      { value: '14', label: 'Class.14 - Patent/franchise (life +1)', rate: 'SL' },
      { value: '43', label: 'Class 43 - 30%', rate: '30' },
      { value: '43.1', label: 'Class 43.1 - 30%', rate: '30' },
      { value: '43.2', label: 'Class 43.2 - 50%', rate: '50' },
      { value: '44', label: 'Class 44 - 25%', rate: '25' },
      { value: '45', label: 'Class 45 - 45%', rate: '45' },
      { value: '50', label: 'Class 50 - 55%', rate: '55' },
      { value: '53', label: 'Class 53 - 50%', rate: '50' },
      { value: '54', label: 'Class 54 - 30%', rate: '30' },
      { value: '55', label: 'Class 55 - 40%', rate: '40' }
    ];
    
    // Handle class selection and auto-populate rate
    const handleClassSelection = (itemId, classValue) => {
      const selectedClass = ccaClasses.find(cls => cls.value === classValue);
      const rate = selectedClass ? selectedClass.rate : '';
      
      updateCCAItem(itemId, 'classNumber', classValue);
      updateCCAItem(itemId, 'rate', rate);
    };
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">CCA Schedule</h3>
          <button
            type="button"
            onClick={addCCAItem}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Add Asset Class
          </button>
        </div>
        
        {ccaItems.length === 0 ? (
          <div className="p-6 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No CCA items added yet. Click "Add Asset Class" to begin.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {ccaItems.map((item, index) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">Asset Class #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeCCAItem(item.id)}
                    className="text-red-600 hover:text-red-800 flex items-center"
                  >
                    <Trash size={16} className="mr-1" />
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CCA Class</label>
                    <select
                      value={item.classNumber}
                      onChange={(e) => handleClassSelection(item.id, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="">-- Select CCA Class --</option>
                      {ccaClasses.map(cls => (
                        <option key={cls.value} value={cls.value}>{cls.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CCA Rate (%)</label>
                    <input
                      type="text"
                      value={item.rate}
                      onChange={(e) => updateCCAItem(item.id, 'rate', e.target.value)}
                      placeholder="CCA Rate"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateCCAItem(item.id, 'description', e.target.value)}
                    placeholder="Asset Description"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening UCC</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        value={item.undepreciatedCapitalCost}
                        onChange={(e) => updateCCAItem(item.id, 'undepreciatedCapitalCost', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additions</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        value={item.additions}
                        onChange={(e) => updateCCAItem(item.id, 'additions', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dispositions</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        value={item.dispositions}
                        onChange={(e) => updateCCAItem(item.id, 'dispositions', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <HelpCircle size={18} className="text-blue-500 mr-2 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">CCA Schedule Information</p>
              <p>Add a separate entry for each CCA class of assets. For each class, enter:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>CCA Class (e.g., Class 8, Class 10, etc.)</li>
                <li>Description of the assets in that class</li>
                <li>Undepreciated Capital Cost (UCC) at the beginning of the year</li>
                <li>Cost of additions during the year</li>
                <li>Proceeds of disposition during the year</li>
              </ul>
              <p className="mt-2">The system will help calculate the CCA for each class based on the CRA's prescribed rates.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Checkbox group component
  const CheckboxGroupField = ({ id, options, value, onChange }) => {
    // Initialize with formData values or empty array
    const [selectedOptions, setSelectedOptions] = useState(value || []);
    
    // Handle checkbox change
    const handleCheckboxChange = (optionId) => {
      let newSelection;
      if (selectedOptions.includes(optionId)) {
        newSelection = selectedOptions.filter(item => item !== optionId);
      } else {
        newSelection = [...selectedOptions, optionId];
      }
      setSelectedOptions(newSelection);
      if (onChange) {
        onChange(newSelection);
      }
    };
    
    return (
      <div className="space-y-3">
        {options.map((option) => (
          <div 
            key={option.id} 
            className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input 
              type="checkbox"
              id={`${id}_${option.id}`}
              checked={selectedOptions.includes(option.id)}
              onChange={() => handleCheckboxChange(option.id)}
              className="h-5 w-5 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="ml-3">
              <label htmlFor={`${id}_${option.id}`} className="font-medium text-gray-700 cursor-pointer">
                {option.label}
              </label>
              {option.tooltip && (
                <p className="mt-1 text-sm text-gray-500">{option.tooltip}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // T5 Slip Preview Component
  const T5SlipPreview = ({ data }) => {
    // Helper function for formatting dates consistently
    const formatDateLocal = (dateString) => {
      // Use the same formatDate function to ensure consistency
      return formatDate(dateString);
    };
    
    // Calculate taxable amounts and credits based on CRA formulas
    const nonEligibleDividends = parseFloat(data.nonEligibleDividendsPaidAmount) || 0;
    const eligibleDividends = parseFloat(data.eligibleDividendsPaidAmount) || 0;
    
    // CRA formulas for 2024 (Update these rates as needed)
    const nonEligibleGrossUp = 1.15; // 15% gross-up for non-eligible dividends
    const nonEligibleTaxCredit = 0.090301; // 9.0301% credit for non-eligible dividends
    const eligibleGrossUp = 1.38; // 38% gross-up for eligible dividends
    const eligibleTaxCredit = 0.150198; // 15.0198% credit for eligible dividends
    
    // Calculate taxable amounts and credits
    const nonEligibleTaxable = (nonEligibleDividends * nonEligibleGrossUp).toFixed(2);
    const nonEligibleCredit = (parseFloat(nonEligibleTaxable) * nonEligibleTaxCredit).toFixed(2);
    const eligibleTaxable = (eligibleDividends * eligibleGrossUp).toFixed(2);
    const eligibleCredit = (parseFloat(eligibleTaxable) * eligibleTaxCredit).toFixed(2);
    
    // Format recipient address
    const formatAddress = () => {
      const street = data.t5RecipientAddress_street || '';
      const city = data.t5RecipientAddress_city || '';
      const province = data.t5RecipientAddress_province || '';
      const postalCode = data.t5RecipientAddress_postalCode || '';
      const country = data.t5RecipientAddress_country || '';
      
      // Format the address as a multi-line display
      const addressParts = [street, city, province, postalCode, country].filter(Boolean);
      if (addressParts.length === 0) return 'No address provided';
      
      return addressParts.join(', ');
    };
    
    // Format payer address
    const formatPayerAddress = () => {
      const name = data.t5PayerName_name || data.corporationName || '';
      const street = data.t5PayerName_street || '';
      const city = data.t5PayerName_city || '';
      const province = data.t5PayerName_province || '';
      const postalCode = data.t5PayerName_postalCode || '';
      
      return [name, street, city, province, postalCode].filter(Boolean).join(', ');
    };
    
    // Format SIN for display
    const formatSIN = (sin) => {
      if (!sin) return '';
      // Remove any existing dashes
      const cleanSin = sin.replace(/-/g, '');
      // Add dashes if it's a 9-digit number
      if (/^\d{9}$/.test(cleanSin)) {
        return `${cleanSin.substring(0, 3)}-${cleanSin.substring(3, 6)}-${cleanSin.substring(6, 9)}`;
      }
      return sin;
    };
    
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6 mt-4">
        <div className="flex justify-between mb-6">
          <div className="flex items-center">
            <FileSpreadsheet size={24} className="text-blue-500 mr-2" />
            <h3 className="text-lg font-bold">T5 Slip Preview</h3>
          </div>
          <div className="text-sm text-gray-500">Tax Year: {data.t5Year || new Date().getFullYear()}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-1">Recipient Information</h4>
            <div className="border-t border-gray-200 pt-2">
              <div className="text-gray-700 font-medium">{data.t5RecipientName || 'N/A'}</div>
              <div className="text-gray-600 text-sm mt-1 mb-1">{formatAddress()}</div>
              <div className="text-xs text-blue-500 italic">
                Complete mailing address is required for T5 slips
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500 mr-2">SIN:</span>
                <span className="text-sm font-medium">{formatSIN(data.t5SIN)}</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500 mr-2">Recipient Type:</span>
                <span className="text-sm font-medium">{
                  data.t5RecipientType === '1' ? 'Individual' :
                  data.t5RecipientType === '2' ? 'Joint Account' :
                  data.t5RecipientType === '3' ? 'Corporation' :
                  data.t5RecipientType === '4' ? 'Association/Trust/Club/Partnership' :
                  data.t5RecipientType === '5' ? 'Government' : 'N/A'
                }</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-1">Payer Information</h4>
            <div className="border-t border-gray-200 pt-2">
              <div className="text-gray-600 text-sm">{formatPayerAddress()}</div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500 mr-2">Report Code:</span>
                <span className="text-sm font-medium">{
                  data.t5ReportCode === 'O' ? 'Original' :
                  data.t5ReportCode === 'A' ? 'Amended' :
                  data.t5ReportCode === 'C' ? 'Cancelled' : 'N/A'
                }</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500 mr-2">Payment Date:</span>
                <span className="text-sm font-medium">{data.t5PaymentDate ? formatDateLocal(data.t5PaymentDate) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-500 mb-1">Dividends from Canadian Corporations</h4>
          <div className="border-t border-gray-200 pt-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500">Box 24 - Actual amount of eligible dividends</div>
                <div className="font-medium">${eligibleDividends.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Box 25 - Taxable amount of eligible dividends</div>
                <div className="font-medium">${eligibleTaxable}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Box 26 - Dividend tax credit for eligible dividends</div>
                <div className="font-medium">${eligibleCredit}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Box 10 - Actual amount of dividends other than eligible dividends</div>
                <div className="font-medium">${nonEligibleDividends.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Box 11 - Taxable amount of dividends other than eligible dividends</div>
                <div className="font-medium">${nonEligibleTaxable}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Box 12 - Dividend tax credit for dividends other than eligible dividends</div>
                <div className="font-medium">${nonEligibleCredit}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex items-center">
            <RefreshCw size={16} className="mr-2" />
            <span>Calculated values are based on CRA formulas for the {data.t5Year || new Date().getFullYear()} tax year</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Generate T5 slip field mapping - with fixed date formatting
  const generateT5FieldMapping = () => {
    // If T5 slips are not required, return empty array
    if (formData.t5Required !== true) return [];
    
    // Calculate T5 values based on CRA formulas
    const nonEligibleDividends = parseFloat(formData.nonEligibleDividendsPaidAmount) || 0;
    const eligibleDividends = parseFloat(formData.eligibleDividendsPaidAmount) || 0;
    
    // CRA formulas for 2024
    const nonEligibleGrossUp = 1.15; // 15% gross-up for non-eligible dividends
    const nonEligibleTaxCredit = 0.090301; // 9.0301% credit for non-eligible dividends
    const eligibleGrossUp = 1.38; // 38% gross-up for eligible dividends
    const eligibleTaxCredit = 0.150198; // 15.0198% credit for eligible dividends
    
    // Calculate taxable amounts and credits
    const nonEligibleTaxable = (nonEligibleDividends * nonEligibleGrossUp).toFixed(2);
    const nonEligibleCredit = (parseFloat(nonEligibleTaxable) * nonEligibleTaxCredit).toFixed(2);
    const eligibleTaxable = (eligibleDividends * eligibleGrossUp).toFixed(2);
    const eligibleCredit = (parseFloat(eligibleTaxable) * eligibleTaxCredit).toFixed(2);
    
    // Format address for display
    const formatRecipientAddress = () => {
      const street = formData.t5RecipientAddress_street || '';
      const city = formData.t5RecipientAddress_city || '';
      const province = formData.t5RecipientAddress_province || '';
      const postalCode = formData.t5RecipientAddress_postalCode || '';
      
      return [street, city, province, postalCode].filter(Boolean).join(', ');
    };
    
    // Format payer address for display
    const formatPayerAddress = () => {
      const name = formData.t5PayerName_name || formData.corporationName || '';
      const street = formData.t5PayerName_street || '';
      const city = formData.t5PayerName_city || '';
      const province = formData.t5PayerName_province || '';
      const postalCode = formData.t5PayerName_postalCode || '';
      
      return [name, street, city, province, postalCode].filter(Boolean).join(', ');
    };
    
    // Create T5 field mapping
    const t5Mapping = [
      {
        fieldId: 't5Year',
        section: 't5',
        fieldName: 'Tax Year',
        formLine: 'T5 - Year',
        value: formData.t5Year || new Date().getFullYear()
      },
      {
        fieldId: 't5RecipientName',
        section: 't5',
        fieldName: 'Recipient Name',
        formLine: 'T5 - Recipient\'s name',
        value: formData.t5RecipientName
      },
      {
        fieldId: 't5RecipientAddress',
        section: 't5',
        fieldName: 'Recipient Address',
        formLine: 'T5 - Recipient\'s address',
        value: formatRecipientAddress()
      },
      {
        fieldId: 't5SIN',
        section: 't5',
        fieldName: 'Recipient SIN',
        formLine: 'T5 Box 22 - Recipient identification number',
        value: formData.t5SIN
      },
      {
        fieldId: 't5RecipientType',
        section: 't5',
        fieldName: 'Recipient Type',
        formLine: 'T5 Box 23 - Recipient type',
        value: formData.t5RecipientType === '1' ? '1 - Individual' :
               formData.t5RecipientType === '2' ? '2 - Joint Account' :
               formData.t5RecipientType === '3' ? '3 - Corporation' :
               formData.t5RecipientType === '4' ? '4 - Association/Trust/Club/Partnership' :
               formData.t5RecipientType === '5' ? '5 - Government' : 'N/A'
      },
      {
        fieldId: 't5PaymentDate',
        section: 't5',
        fieldName: 'Dividend Payment Date',
        formLine: 'T5 - Date dividends paid',
        value: formData.t5PaymentDate ? formatDate(formData.t5PaymentDate) : 'N/A'
      },
      {
        fieldId: 't5ReportCode',
        section: 't5',
        fieldName: 'Report Code',
        formLine: 'T5 Box 21 - Report code',
        value: formData.t5ReportCode === 'O' ? 'O - Original' :
               formData.t5ReportCode === 'A' ? 'A - Amended' :
               formData.t5ReportCode === 'C' ? 'C - Cancelled' : 'N/A'
      },
      {
        fieldId: 't5PayerName',
        section: 't5',
        fieldName: 'Payer Name and Address',
        formLine: 'T5 - Payer\'s name and address',
        value: formatPayerAddress()
      }
    ];
    
    // Add dividend fields if applicable
    if (eligibleDividends > 0) {
      t5Mapping.push(
        {
          fieldId: 'eligibleDividendsPaidAmount',
          section: 't5',
          fieldName: 'Eligible Dividends',
          formLine: 'T5 Box 24 - Actual amount of eligible dividends',
          value: `${eligibleDividends.toLocaleString()}`
        },
        {
          fieldId: 'eligibleDividendsTaxable',
          section: 't5',
          fieldName: 'Taxable Eligible Dividends',
          formLine: 'T5 Box 25 - Taxable amount of eligible dividends',
          value: `${eligibleTaxable}`,
          details: 'Calculated as 138% of Box 24 (38% gross-up)'
        },
        {
          fieldId: 'eligibleDividendsCredit',
          section: 't5',
          fieldName: 'Eligible Dividends Tax Credit',
          formLine: 'T5 Box 26 - Dividend tax credit for eligible dividends',
          value: `${eligibleCredit}`,
          details: 'Calculated as 15.0198% of Box 25'
        }
      );
    }
    
    if (nonEligibleDividends > 0) {
      t5Mapping.push(
        {
          fieldId: 'nonEligibleDividendsPaidAmount',
          section: 't5',
          fieldName: 'Non-Eligible Dividends',
          formLine: 'T5 Box 10 - Actual amount of dividends other than eligible dividends',
          value: `${nonEligibleDividends.toLocaleString()}`
        },
        {
          fieldId: 'nonEligibleDividendsTaxable',
          section: 't5',
          fieldName: 'Taxable Non-Eligible Dividends',
          formLine: 'T5 Box 11 - Taxable amount of dividends other than eligible dividends',
          value: `${nonEligibleTaxable}`,
          details: 'Calculated as 115% of Box 10 (15% gross-up)'
        },
        {
          fieldId: 'nonEligibleDividendsCredit',
          section: 't5',
          fieldName: 'Non-Eligible Dividends Tax Credit',
          formLine: 'T5 Box 12 - Dividend tax credit for dividends other than eligible dividends',
          value: `${nonEligibleCredit}`,
          details: 'Calculated as 9.0301% of Box 11'
        }
      );
    }
    
    return t5Mapping;
  };
  
  // Make sure we include all T5 steps as defined in your original code
  // Don't filter steps based on conditions if we don't have enough data yet
  let filteredSteps = [];
  
  // If we don't have any formData yet, or if we're just starting
  // just show the full set of steps without applying conditions
  if (Object.keys(formData).length < 3) {
    filteredSteps = steps;
  } else {
    // Only apply filtering when we have sufficient form data
    filteredSteps = steps.filter(step => {
      if (!step.condition) return true;
      return step.condition(formData);
    });
  }
  
  // Safety check: ensure that filteredSteps is not empty
  if (filteredSteps.length === 0) {
    // Add a default step if there are no steps after filtering
    filteredSteps.push({
      id: 'default',
      section: 'identification',
      title: 'No Steps Available',
      question: 'Please reset the form and start again.',
      fieldType: 'text',
      tooltip: 'Something went wrong with the form configuration.',
      formLine: '',
      required: false
    });
  }
  
  // Safety check: ensure currentStep is within bounds
  const safeCurrentStep = Math.min(currentStep, filteredSteps.length - 1);
  if (safeCurrentStep !== currentStep) {
    setCurrentStep(safeCurrentStep);
  }
  
  // Get section for current step
  const getSectionForStep = (stepIndex) => {
    if (stepIndex >= filteredSteps.length) return 'identification';
    return filteredSteps[stepIndex].section;
  };
  
  // Calculate progress percentage based on total visible steps
  const calculateProgress = () => {
    if (filteredSteps.length === 0) return 0;
    return Math.min(100, Math.round(((safeCurrentStep + 1) / filteredSteps.length) * 100));
  };
  
  // Navigate to next step - updated to handle special validation for review/certification
  const nextStep = () => {
    const currentStepData = filteredSteps[safeCurrentStep];
    
    if (!currentStepData) {
      console.error("Current step data is undefined");
      return;
    }
    
    // Special handling for the certification/review step
    if (currentStepData.fieldType === 'review') {
      // Always allow the user to proceed past the review step
      if (safeCurrentStep < filteredSteps.length - 1) {
        setCurrentStep(safeCurrentStep + 1);
        window.scrollTo(0, 0);
      } else {
        // This is the final step, complete the form
        const t2Mapping = generateFieldMapping();
        let allMapping = [...t2Mapping];
        
        // Add T5 mapping if applicable
        if (formData.t5Required === true) {
          const t5Mapping = generateT5FieldMapping();
          allMapping = [...allMapping, ...t5Mapping];
        }
        
        // Mark the certification as complete
        const updatedFormData = {
          ...formData,
          certification: true
        };
        setFormData(updatedFormData);
        localStorage.setItem('t2WizardFormData', JSON.stringify(updatedFormData));
        
        setFieldMapping(allMapping);
        setFormComplete(true);
        window.scrollTo(0, 0);
      }
      return;
    }
    
    // Special handling for CCA Schedule field
    if (currentStepData.fieldType === 'ccaSchedule') {
      // No validation needed, just save the data
      const updatedFormData = {
        ...formData,
        ccaItems: ccaItems
      };
      setFormData(updatedFormData);
      localStorage.setItem('t2WizardFormData', JSON.stringify(updatedFormData));
    }
    
    // Special handling for composite address fields
    if (currentStepData.fieldType === 'compositeAddress') {
      const requiredAddressFields = [
        `${currentStepData.id}_street`,
        `${currentStepData.id}_city`,
        `${currentStepData.id}_province`,
        `${currentStepData.id}_postalCode`
      ];
      
      // Check if all required address fields are filled
      const missingFields = requiredAddressFields.filter(field => !formData[field]);
      
      if (currentStepData.required && missingFields.length > 0) {
        alert('Please complete all address fields before continuing.');
        return;
      }
    }
    // Special handling for composite company address fields
    else if (currentStepData.fieldType === 'compositeCompanyAddress') {
      // For company address, don't validate - it's too problematic
      // Just let the user continue
    }
    // Regular validation for non-composite fields
    else if (currentStepData.required && formData[currentStepData.id] === undefined) {
      alert('Please complete this field before continuing.');
      return;
    }
    
    // Custom validation if available
    if (currentStepData.validation && formData[currentStepData.id] !== undefined) {
      const isValid = currentStepData.validation(formData[currentStepData.id], formData);
      if (!isValid) {
        alert(currentStepData.validationMessage || 'Invalid input. Please check your entry.');
        return;
      }
    }
    
    if (safeCurrentStep < filteredSteps.length - 1) {
      // Find the next visible step
      const nextStepIndex = safeCurrentStep + 1;
      setCurrentStep(nextStepIndex);
      window.scrollTo(0, 0);
      
      // Update form data with default values if needed
      if (currentStepData.defaultValue && formData[currentStepData.id] === undefined) {
        handleChange(currentStepData.id, currentStepData.defaultValue);
      }
    } else {
      // Generate field mapping for T2 form
      const t2Mapping = generateFieldMapping();
      let allMapping = [...t2Mapping];
      
      // Add T5 mapping if applicable
      if (formData.t5Required === true) {
        const t5Mapping = generateT5FieldMapping();
        allMapping = [...allMapping, ...t5Mapping];
      }
      
      setFieldMapping(allMapping);
      setFormComplete(true);
      window.scrollTo(0, 0);
    }
  };
  
  // Go back to previous step
  const prevStep = () => {
    if (safeCurrentStep > 0) {
      setCurrentStep(safeCurrentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle input changes
  const handleChange = (id, value) => {
    // Convert string 'true'/'false' to actual boolean values for proper condition checking
    let processedValue = value;
    if (value === 'true') processedValue = true;
    if (value === 'false') processedValue = false;
    
    const updatedFormData = {
      ...formData,
      [id]: processedValue
    };
    
    // Update state
    setFormData(updatedFormData);
    
    // Save to localStorage after each change
    localStorage.setItem('t2WizardFormData', JSON.stringify(updatedFormData));
    
    // If this is a T5-related field, update the T5 slip preview
    if (id.startsWith('t5') || id.includes('Dividends')) {
      updateT5SlipPreview(updatedFormData);
    }
  };
  
  // Handle composite address changes
  const handleAddressChange = (id, field, value) => {
    const updatedFormData = {
      ...formData,
      [`${id}_${field}`]: value
    };
    
    // Update state
    setFormData(updatedFormData);
    
    // Save to localStorage after each change
    localStorage.setItem('t2WizardFormData', JSON.stringify(updatedFormData));
    
    // If this is a T5-related field, update the T5 slip preview
    if (id.startsWith('t5')) {
      updateT5SlipPreview(updatedFormData);
    }
  };
  
  // Simplified company address change handler
  const handleCompanyAddressChange = (values) => {
    // Do a simple shallow merge
    setFormData(prevFormData => {
      const newFormData = { ...prevFormData, ...values };
      
      // Save to localStorage
      localStorage.setItem('t2WizardFormData', JSON.stringify(newFormData));
      
      // Update T5 preview if needed
      const hasT5Fields = Object.keys(values).some(key => key.startsWith('t5'));
      if (hasT5Fields) {
        updateT5SlipPreview(newFormData);
      }
      
      return newFormData;
    });
  };
  
  // Reset form data and localStorage
  const resetFormData = () => {
    setFormData({});
    localStorage.removeItem('t2WizardFormData');
    setCurrentStep(0);
    setCcaItems([]);
    setShowResetModal(false);
  };
  
  // Update T5 slip preview
  const updateT5SlipPreview = (data) => {
    // Only update if T5 is required
    if (data.t5Required === true) {
      setT5SlipPreview(<T5SlipPreview data={data} />);
    }
  };
  
  // Show tooltip
  const showTooltip = (e, content) => {
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      content,
      position: {
        x: rect.right + 10,
        y: rect.top
      }
    });
  };
  
  // Hide tooltip
  const hideTooltip = () => {
    setTooltip({
      ...tooltip,
      visible: false
    });
  };
  
  // Generate T2 form field mapping
  const generateFieldMapping = () => {
    const mapping = filteredSteps
      .filter(step => step.formLine && formData[step.id] !== undefined && step.id !== 'summarize' && !step.id.startsWith('t5'))
      .map(step => {
        // Format the display value based on field type
        let displayValue = formData[step.id];
        
        if (step.fieldType === 'radio' && step.options) {
          const option = step.options.find(o => String(o.value) === String(displayValue));
          displayValue = option ? option.label : displayValue;
        } else if (step.fieldType === 'select' && step.options) {
          const option = step.options.find(o => o.value === displayValue);
          displayValue = option ? option.label : displayValue;
        } else if (step.fieldType === 'date' && displayValue) {
          displayValue = formatDate(displayValue);
        } else if (step.fieldType === 'currency' && displayValue) {
          displayValue = `${parseFloat(displayValue).toLocaleString()}`;
        } else if (step.fieldType === 'compositeAddress') {
          // Format composite address fields
          const streetAddress = formData[`${step.id}_street`] || '';
          const city = formData[`${step.id}_city`] || '';
          const province = formData[`${step.id}_province`] || '';
          const postalCode = formData[`${step.id}_postalCode`] || '';
          const country = formData[`${step.id}_country`] || 'Canada';
          
          displayValue = `${streetAddress}, ${city}, ${province}, ${postalCode}, ${country}`;
        } else if (step.fieldType === 'checkboxes' && Array.isArray(displayValue)) {
          displayValue = displayValue.join(', ');
        } else if (step.fieldType === 'ccaSchedule') {
          // CCA Schedule information - summarize
          displayValue = `${ccaItems.length} asset class(es) added`;
        }
        
        return {
          fieldId: step.id,
          section: step.section,
          fieldName: step.question,
          formLine: step.formLine,
          value: displayValue
        };
      });
    
    // Add CCA items if available
    if (ccaItems && ccaItems.length > 0) {
      // Add a header entry for CCA
      mapping.push({
        fieldId: 'ccaHeader',
        section: 'cca',
        fieldName: 'Capital Cost Allowance (CCA) Details',
        formLine: 'T2 - Schedule 8 - CCA Summary',
        value: `${ccaItems.length} Asset Classes`
      });
      
      // Add individual CCA items
      ccaItems.forEach((item, index) => {
        mapping.push({
          fieldId: `cca-${index}`,
          section: 'cca',
          fieldName: `CCA Class ${item.classNumber} - ${item.description}`,
          formLine: `T2 - Schedule 8 - Class ${item.classNumber}`,
          value: `UCC: ${parseFloat(item.undepreciatedCapitalCost || 0).toLocaleString()}, Additions: ${parseFloat(item.additions || 0).toLocaleString()}, Rate: ${item.rate}%`
        });
      });
    }
    
    return mapping;
  };
  
  // Make sure we have a current step data
  const currentStepData = filteredSteps[safeCurrentStep] || filteredSteps[0];
  const currentSection = getSectionForStep(safeCurrentStep);
  const sectionInfo = sections.find(s => s.id === currentSection) || sections[0];
  
  // If all steps are complete, show summary
  if (formComplete) {
    // Group field mapping by section for better organization
    const fieldsBySection = {};
    sections.forEach(section => {
      fieldsBySection[section.id] = [];
    });
    
    // Group fields by section
    fieldMapping.forEach(field => {
      if (field.section && fieldsBySection[field.section]) {
        fieldsBySection[field.section].push(field);
      } else {
        // If no section or unknown section, add to certification (summary section)
        if (fieldsBySection['certification']) {
          fieldsBySection['certification'].push(field);
        }
      }
    });
    
    // Determine if T5 information is present
    const hasT5Data = formData.t5Required === true;
    
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white min-h-screen">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">T2 and T5 Summary</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Review your information below. This summary shows where your information maps to the T2 form fields
            {hasT5Data ? ' and T5 slip fields' : ''}.
            Required schedules are listed at the bottom.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {sections.map((section) => {
            const sectionFields = fieldsBySection[section.id] || [];
            if (sectionFields.length === 0) return null;
            
            return (
              <div 
                key={section.id} 
                className="rounded-xl overflow-hidden shadow-md"
                style={{ borderTop: `4px solid ${section.color}` }}
              >
                <div className="bg-gray-50 p-4 flex items-center gap-2" style={{ backgroundColor: `${section.color}10` }}>
                  <div className="p-2 rounded-full" style={{ backgroundColor: `${section.color}20` }}>
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">{section.name}</h2>
                </div>
                
                <div className="p-4">
                  {sectionFields.map((field) => (
                    <div key={field.fieldId} className="mb-4 p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{field.fieldName}</h3>
                          <p className="text-sm text-gray-500 mt-1">{field.formLine}</p>
                          {field.details && <p className="text-xs text-gray-500 mt-1 italic">{field.details}</p>}
                        </div>
                        <div className="font-medium text-gray-900">{field.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* T5 Slip Preview Section (if applicable) */}
        {hasT5Data && (
          <div className="mt-10 mb-8 rounded-xl overflow-hidden shadow-md border-t-4 border-blue-500">
            <div className="bg-blue-50 p-4 flex items-center gap-2">
              <div className="p-2 rounded-full bg-blue-100">
                <FileSpreadsheet size={20} className="text-blue-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">T5 Slip Preview</h2>
            </div>
            
            <div className="p-4">
              {t5SlipPreview || <T5SlipPreview data={formData} />}
            </div>
          </div>
        )}
        
        {/* Required Schedules Section */}
        <div className="mt-10 mb-8 rounded-xl overflow-hidden shadow-md border-t-4 border-amber-500">
          <div className="bg-amber-50 p-4 flex items-center gap-2">
            <div className="p-2 rounded-full bg-amber-100">
              <FileText size={20} className="text-amber-700" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Required Schedules</h2>
          </div>
          
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 border-b">Schedule</th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 border-b">Description</th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 border-b">Reason Required</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="py-3 px-4 text-sm text-gray-900">Schedule 1</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Net Income (Loss) for Income Tax Purposes</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Required for all corporations</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">Schedule 8</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Capital Cost Allowance (CCA)</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Required when claiming CCA</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 text-sm text-gray-900">Schedule 50</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Shareholder Information</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Required for all corporations with shareholders</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">Schedule 100</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Balance Sheet Information</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Required for all corporations</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 text-sm text-gray-900">Schedule 125</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Income Statement Information</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Required for all corporations</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">Schedule 141</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Notes Checklist</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Required for all corporations</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 text-sm text-gray-900">Schedule 200</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Corporation Tax Calculation</td>
                    <td className="py-3 px-4 text-sm text-gray-900">Required for all corporations</td>
                  </tr>
                  {/* Add T5 row if applicable */}
                  {hasT5Data && (
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">T5 Slips & Summary</td>
                      <td className="py-3 px-4 text-sm text-gray-900">Statement of Investment Income</td>
                      <td className="py-3 px-4 text-sm text-gray-900">Required when dividend payments are made to shareholders</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <div className="flex gap-3">
            <button 
              onClick={() => {setFormComplete(false); setCurrentStep(filteredSteps.length - 1);}}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg flex items-center shadow-sm hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft size={18} className="mr-2" /> Back to Edit
            </button>
            
            <button 
              onClick={() => setShowResetModal(true)}
              className="px-6 py-3 bg-red-50 text-red-600 rounded-lg flex items-center shadow-sm hover:bg-red-100 transition-colors"
            >
              <RefreshCw size={18} className="mr-2" /> Reset Data
            </button>
          </div>
          
          <button 
            onClick={() => alert('Form data is saved in your browser. You can now manually enter this information into FutureTax or your preferred tax filing software.')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Check size={18} className="mr-2" /> Complete Filing
          </button>
        </div>
        
        {/* JSON Export Section (optional) */}
        {hasT5Data && (
          <div className="mt-10 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <details>
              <summary className="font-medium text-gray-700 cursor-pointer">T5 Slip JSON Data</summary>
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-xs">
                {JSON.stringify(generateT5FieldMapping().reduce((obj, item) => {
                  obj[item.formLine] = item.value;
                  return obj;
                }, {}), null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    );
  }
  
  // Reset confirmation modal
  const ResetConfirmationModal = () => {
    if (!showResetModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Reset Form Data</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to reset all form data? This will clear all your entries and cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowResetModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={resetFormData}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render current step
  return (
    <div className="w-full max-w-6xl mx-auto flex min-h-screen bg-gray-50">
      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal />
      
      {/* Sidebar / Progress Tracker */}
      <div className="hidden lg:block w-72 bg-white p-6 border-r border-gray-200">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-1">T2 Corporation Tax</h1>
          <p className="text-sm text-gray-500">Filing Wizard for Tax Year {formData.taxYearStart ? new Date(formData.taxYearStart).getFullYear() : new Date().getFullYear()}</p>
        </div>
        
        <div className="mb-4">
          <button 
            onClick={() => setShowResetModal(true)}
            className="text-sm text-red-600 hover:text-red-800 flex items-center"
          >
            <RefreshCw size={14} className="mr-1" /> Reset Form Data
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Overall Progress</span>
            <span className="text-gray-600">{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
        
        <div className="space-y-1">
          {sections.map((section) => {
            // Check if any step in this section is in the filtered steps
            const sectionHasSteps = filteredSteps.some(step => step.section === section.id);
            if (!sectionHasSteps) return null;
            
            // Check if this section is active
            const isActive = currentSection === section.id;
            // Check if this section is completed
            const isCompleted = filteredSteps.some(step => 
              step.section === section.id && 
              step.id !== currentStepData.id && 
              formData[step.id] !== undefined
            );
            
            return (
              <div 
                key={section.id}
                className={`flex items-center p-3 rounded-lg ${
                  isActive 
                    ? 'bg-gray-100 text-gray-900' 
                    : isCompleted 
                      ? 'text-gray-600' 
                      : 'text-gray-400'
                }`}
              >
                <div 
                  className={`p-1.5 rounded-md mr-3 ${
                    isActive 
                      ? 'bg-white text-gray-900' 
                      : isCompleted 
                        ? 'bg-gray-100 text-gray-600' 
                        : 'bg-gray-100 text-gray-400'
                  }`}
                  style={isActive ? { color: section.color } : {}}
                >
                  {section.icon}
                </div>
                <span className="font-medium">{section.name}</span>
                {isCompleted && <Check size={16} className="ml-auto text-green-500" />}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 py-8 px-4 md:px-10 flex flex-col min-h-[calc(100vh-130px)]">
        {/* Mobile Progress Bar */}
        <div className="lg:hidden mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Step {safeCurrentStep + 1} of {filteredSteps.length}</span>
            <span className="text-gray-600">{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
        
        {/* Current Section Heading */}
        <div 
          className="mb-6 pb-4 border-b border-gray-200" 
          style={{ borderColor: sectionInfo.color + '40' }}
        >
          <div className="flex items-center">
            <div 
              className="p-2 rounded-md mr-3 text-white" 
              style={{ backgroundColor: sectionInfo.color }}
            >
              {sectionInfo.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{sectionInfo.name}</h2>
              <p className="text-sm text-gray-500">Step {safeCurrentStep + 1} of {filteredSteps.length}: {currentStepData.title}</p>
            </div>
          </div>
        </div>
        
        {/* Main content area with flex-grow to push buttons to bottom */}
        <div className="flex-grow">
          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-medium text-gray-800">{currentStepData.question}</h3>
                {currentStepData.tooltip && (
                  <button 
                    className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onMouseEnter={(e) => showTooltip(e, currentStepData.tooltip)}
                    onMouseLeave={hideTooltip}
                  >
                    <HelpCircle size={18} />
                  </button>
                )}
              </div>
              
              {/* Tooltip */}
              {tooltip.visible && (
                <div 
                  className="fixed bg-gray-800 text-white p-3 rounded shadow-lg max-w-xs z-10"
                  style={{ 
                    top: `${tooltip.position.y}px`, 
                    left: `${tooltip.position.x}px`,
                    maxWidth: '280px' 
                  }}
                >
                  {tooltip.content}
                </div>
              )}
              
              {/* Field-specific note about CRA requirements */}
              {currentStepData.formLine && (
                <div className="mb-4 text-sm text-gray-500 flex items-start">
                  <Hash size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                  <div>
                    This corresponds to <span className="font-medium">{currentStepData.formLine}</span> on the {currentStepData.formLine.startsWith('T5') ? 'T5 slip' : 'T2 form'}.
                  </div>
                </div>
              )}
              
              {/* Input field based on type */}
              <div className="mt-4">
                {currentStepData.fieldType === 'text' && (
                  <input 
                    type="text" 
                    value={formData[currentStepData.id] || ''}
                    onChange={(e) => handleChange(currentStepData.id, e.target.value)}
                    placeholder={currentStepData.placeholder || ''}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
                
                {currentStepData.fieldType === 'select' && (
                  <select
                    value={formData[currentStepData.id] || ''}
                    onChange={(e) => handleChange(currentStepData.id, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">-- Please select --</option>
                    {currentStepData.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                
                {currentStepData.fieldType === 'radio' && (
                  <div className="space-y-3">
                    {currentStepData.options.map((option) => (
                      <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input 
                          type="radio"
                          name={currentStepData.id}
                          value={option.value}
                          checked={String(formData[currentStepData.id]) === String(option.value)}
                          onChange={() => handleChange(currentStepData.id, option.value)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-3 text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {currentStepData.fieldType === 'date' && (
                  <input 
                    type="date" 
                    value={formData[currentStepData.id] || ''}
                    onChange={(e) => handleChange(currentStepData.id, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
                
                {currentStepData.fieldType === 'compositeAddress' && (
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={formData[`${currentStepData.id}_street`] || ''}
                      onChange={(e) => handleAddressChange(currentStepData.id, 'street', e.target.value)}
                      placeholder="Street Address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        value={formData[`${currentStepData.id}_city`] || ''}
                        onChange={(e) => handleAddressChange(currentStepData.id, 'city', e.target.value)}
                        placeholder="City"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input 
                        type="text" 
                        value={formData[`${currentStepData.id}_province`] || ''}
                        onChange={(e) => handleAddressChange(currentStepData.id, 'province', e.target.value)}
                        placeholder="Province/State"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        value={formData[`${currentStepData.id}_postalCode`] || ''}
                        onChange={(e) => handleAddressChange(currentStepData.id, 'postalCode', e.target.value)}
                        placeholder="Postal/ZIP Code"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input 
                        type="text" 
                        value={formData[`${currentStepData.id}_country`] || 'Canada'}
                        onChange={(e) => handleAddressChange(currentStepData.id, 'country', e.target.value)}
                        placeholder="Country"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
                
                {currentStepData.fieldType === 'compositeCompanyAddress' && (
                  <CompositeCompanyAddressField 
                    id={currentStepData.id} 
                    value={formData} 
                    onChange={handleCompanyAddressChange} 
                  />
                )}
                
                {currentStepData.fieldType === 'currency' && (
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={formData[currentStepData.id] || ''}
                      onChange={(e) => handleChange(currentStepData.id, e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                
                {currentStepData.fieldType === 'number' && (
                  <input 
                    type="number" 
                    value={formData[currentStepData.id] || ''}
                    onChange={(e) => handleChange(currentStepData.id, e.target.value)}
                    placeholder={currentStepData.placeholder || '0'}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
                
                {currentStepData.fieldType === 'checkboxes' && (
                  <CheckboxGroupField
                    id={currentStepData.id}
                    options={currentStepData.options}
                    value={formData[currentStepData.id]}
                    onChange={(value) => handleChange(currentStepData.id, value)}
                  />
                )}
                
                {currentStepData.fieldType === 'ccaSchedule' && (
                  <CCAScheduleField
                    id={currentStepData.id}
                    onChange={(value) => {
                      // Save CCA items to form data
                      const updatedFormData = {
                        ...formData,
                        ccaItems: value
                      };
                      setFormData(updatedFormData);
                      localStorage.setItem('t2WizardFormData', JSON.stringify(updatedFormData));
                    }}
                  />
                )}
                
                {currentStepData.fieldType === 'review' && (
                  <div className="bg-gray-50 p-5 rounded-lg mb-4">
                    <p className="text-gray-700 mb-4 font-medium">Please confirm that the information below is correct:</p>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {sections.map((section) => {
                        // Get all fields for this section that have values
                        const sectionFields = filteredSteps
                          .filter(step => 
                            step.section === section.id && 
                            formData[step.id] !== undefined &&
                            step.id !== 'summarize' &&
                            step.fieldType !== 'reviewT5'
                          );
                        
                        if (sectionFields.length === 0) return null;
                        
                        return (
                          <div key={section.id} className="mb-4">
                            <h4 className="font-medium text-gray-800 flex items-center mb-2">
                              <div className="p-1 rounded-md mr-2" style={{ backgroundColor: section.color + '20', color: section.color }}>
                                {section.icon}
                              </div>
                              {section.name}
                            </h4>
                            
                            <div className="pl-7 space-y-1">
                              {sectionFields.map((step) => {
                                // Format the display value based on field type
                                let displayValue = formData[step.id];
                                
                                if (step.fieldType === 'radio' && step.options) {
                                  const option = step.options.find(o => String(o.value) === String(displayValue));
                                  displayValue = option ? option.label : displayValue;
                                } else if (step.fieldType === 'select' && step.options) {
                                  const option = step.options.find(o => o.value === displayValue);
                                  displayValue = option ? option.label : displayValue;
                                } else if (step.fieldType === 'date' && displayValue) {
                                  displayValue = formatDate(displayValue);
                                } else if (step.fieldType === 'currency' && displayValue) {
                                  displayValue = `${parseFloat(displayValue).toLocaleString()}`;
                                } else if (step.fieldType === 'compositeAddress') {
                                  // Format composite address fields
                                  const streetAddress = formData[`${step.id}_street`] || '';
                                  const city = formData[`${step.id}_city`] || '';
                                  const province = formData[`${step.id}_province`] || '';
                                  const postalCode = formData[`${step.id}_postalCode`] || '';
                                  
                                  displayValue = [streetAddress, city, province, postalCode].filter(Boolean).join(', ');
                                } else if (step.fieldType === 'checkboxes' && Array.isArray(displayValue)) {
                                  // Format checkbox fields
                                  displayValue = displayValue.map(item => {
                                    const option = step.options.find(o => o.id === item);
                                    return option ? option.label.split(' (')[0] : item;
                                  }).join(', ');
                                } else if (step.fieldType === 'ccaSchedule') {
                                  // CCA Schedule information
                                  displayValue = `${ccaItems.length} asset class(es) added`;
                                }
                                
                                return (
                                  <div key={step.id} className="flex justify-between py-1.5 border-b border-gray-200">
                                    <span className="text-gray-600 mr-4">{step.question}</span>
                                    <span className="font-medium text-gray-900 text-right">{displayValue}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {currentStepData.fieldType === 'reviewT5' && (
                  <div>
                    {t5SlipPreview || <T5SlipPreview data={formData} />}
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                        <RefreshCw size={16} className="mr-2" />
                        Calculated Fields
                      </h4>
                      <p className="text-sm text-blue-700 mb-3">
                        The following values are automatically calculated according to CRA formulas:
                      </p>
                      <ul className="text-sm text-blue-600 pl-6 space-y-1 list-disc">
                        <li>Box 11 - Taxable amount of non-eligible dividends: 115% of actual amount</li>
                        <li>Box 12 - Dividend tax credit for non-eligible dividends: 9.0301% of taxable amount</li>
                        <li>Box 25 - Taxable amount of eligible dividends: 138% of actual amount</li>
                        <li>Box 26 - Dividend tax credit for eligible dividends: 15.0198% of taxable amount</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Schedule info alert (if applicable) */}
            {currentStepData.formLine && currentStepData.formLine.includes('Schedule') && (
              <div className="bg-amber-50 p-4 flex items-start border-t border-amber-100">
                <AlertTriangle size={20} className="text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <span className="font-medium">Note:</span> This information will be used to complete <strong>{currentStepData.formLine.split(' - ')[0]}</strong>. Make sure your answer is accurate as it may trigger additional filing requirements.
                </div>
              </div>
            )}
            
            {/* T5 slip info alert (if applicable) */}
            {currentStepData.formLine && currentStepData.formLine.startsWith('T5 Box') && (
              <div className="bg-blue-50 p-4 flex items-start border-t border-blue-100">
                <AlertTriangle size={20} className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <span className="font-medium">Note:</span> This information will be reported on <strong>{currentStepData.formLine.split(' - ')[0]}</strong> of the T5 slip. You must issue T5 slips to all shareholders who received dividends.
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation buttons - fixed at the bottom section */}
        <div className="mt-auto py-6 border-t border-gray-200">
          <div className="flex justify-between">
            <button 
              onClick={prevStep}
              disabled={safeCurrentStep === 0}
              className={`px-5 py-3 rounded-lg flex items-center ${
                safeCurrentStep === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200'
              }`}
            >
              <ChevronLeft size={18} className="mr-2" /> Previous
            </button>
            
            <button 
              onClick={nextStep}
              className={`px-5 py-3 rounded-lg flex items-center shadow-sm ${
                safeCurrentStep === filteredSteps.length - 1
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {safeCurrentStep === filteredSteps.length - 1 ? 'Complete' : 'Next'} 
              {safeCurrentStep === filteredSteps.length - 1 ? <Check size={18} className="ml-2" /> : <ChevronRight size={18} className="ml-2" />}
            </button>
          </div>
          
          {/* Required field indicator */}
          {currentStepData.required && (
            <div className="mt-4 text-sm flex items-center text-gray-500 justify-end">
              <AlertTriangle size={14} className="mr-1" />
              <span>This field is required</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default T2Wizard;