import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, HelpCircle, Check, AlertTriangle, BookOpen, Briefcase, Home, FileText, Calculator, DollarSign, CheckCircle, PieChart, User, Calendar, Hash, FileSpreadsheet, RefreshCw } from 'lucide-react';

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
    { id: 'shareholders', name: 'Shareholder Information', icon: <User size={18} />, color: '#8b5cf6' },
    { id: 'financial', name: 'Financial Information', icon: <DollarSign size={18} />, color: '#22c55e' },
    { id: 'income', name: 'Income & Deductions', icon: <Calculator size={18} />, color: '#ec4899' },
    { id: 'tax', name: 'Tax Calculation', icon: <PieChart size={18} />, color: '#f43f5e' },
    { id: 't5', name: 'T5 Slip Information', icon: <FileSpreadsheet size={18} />, color: '#0ea5e9' },
    { id: 'certification', name: 'Certification', icon: <CheckCircle size={18} />, color: '#6366f1' }
  ];
  
  // Questions and conditional logic
  const steps = [
    // ... [Your existing steps here]
    
    // Section: T5 Slip Information (Add this new section)
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
      condition: (data) => 
        (data.corporationType === 'ccpc' || data.corporationType === 'other-private') && 
        (data.eligibleDividendsPaid === true || data.nonEligibleDividendsPaid === true)
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
      id: 't5OtherInformation',
      section: 't5',
      title: 'Additional T5 Information',
      question: 'Is there any additional information to report on the T5 slip?',
      fieldType: 'checkboxes',
      options: [
        { id: 't5InterestIncome', label: 'Interest from Canadian sources (Box 13)', tooltip: 'Report interest income paid to the shareholder.' },
        { id: 't5ForeignIncome', label: 'Foreign income (Box 15)', tooltip: 'Report income from foreign sources.' },
        { id: 't5ForeignTax', label: 'Foreign tax paid (Box 16)', tooltip: 'Report foreign taxes paid on foreign income.' },
        { id: 't5CapitalGains', label: 'Capital gains dividends (Box 18)', tooltip: 'Report capital gains dividends paid after June 24, 2024.' },
        { id: 't5CapitalGainsP1', label: 'Capital gains dividends - Period 1 (Box 34)', tooltip: 'Report capital gains dividends paid before June 25, 2024.' }
      ],
      tooltip: 'Select any additional information that needs to be reported on the T5 slip.',
      formLine: 'T5 - Other information',
      required: false,
      condition: (data) => data.t5Required === true
    },
    {
      id: 't5InterestIncomeAmount',
      section: 't5',
      title: 'Interest Income Amount',
      question: 'What is the amount of interest income from Canadian sources?',
      fieldType: 'currency',
      tooltip: 'Enter the amount of interest paid from Canadian sources.',
      formLine: 'T5 Box 13 - Interest from Canadian sources',
      required: true,
      condition: (data) => data.t5Required === true && data.t5OtherInformation && data.t5OtherInformation.includes('t5InterestIncome')
    },
    {
      id: 't5ForeignIncomeAmount',
      section: 't5',
      title: 'Foreign Income Amount',
      question: 'What is the amount of foreign income?',
      fieldType: 'currency',
      tooltip: 'Enter the amount of income from foreign sources.',
      formLine: 'T5 Box 15 - Foreign income',
      required: true,
      condition: (data) => data.t5Required === true && data.t5OtherInformation && data.t5OtherInformation.includes('t5ForeignIncome')
    },
    {
      id: 't5ForeignTaxAmount',
      section: 't5',
      title: 'Foreign Tax Paid Amount',
      question: 'What is the amount of foreign tax paid?',
      fieldType: 'currency',
      tooltip: 'Enter the amount of foreign tax paid on foreign income.',
      formLine: 'T5 Box 16 - Foreign tax paid',
      required: true,
      condition: (data) => data.t5Required === true && data.t5OtherInformation && data.t5OtherInformation.includes('t5ForeignTax')
    },
    {
      id: 't5CapitalGainsAmount',
      section: 't5',
      title: 'Capital Gains Dividends Amount',
      question: 'What is the amount of capital gains dividends paid after June 24, 2024?',
      fieldType: 'currency',
      tooltip: 'Enter the amount of capital gains dividends paid after June 24, 2024.',
      formLine: 'T5 Box 18 - Capital gains dividends',
      required: true,
      condition: (data) => data.t5Required === true && data.t5OtherInformation && data.t5OtherInformation.includes('t5CapitalGains')
    },
    {
      id: 't5CapitalGainsP1Amount',
      section: 't5',
      title: 'Capital Gains Dividends Amount (Period 1)',
      question: 'What is the amount of capital gains dividends paid before June 25, 2024?',
      fieldType: 'currency',
      tooltip: 'Enter the amount of capital gains dividends paid before June 25, 2024.',
      formLine: 'T5 Box 34 - Capital gains dividends - Period 1',
      required: true,
      condition: (data) => data.t5Required === true && data.t5OtherInformation && data.t5OtherInformation.includes('t5CapitalGainsP1')
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
    
    // ... [Your existing steps, including certification]
  ];
  
  // Composite field for company address
  const CompositeCompanyAddressField = ({ id, value, onChange }) => {
    // Initialize with formData values or empty strings
    const [companyName, setCompanyName] = useState(value?.[`${id}_name`] || formData[`${id}_name`] || '');
    const [street, setStreet] = useState(value?.[`${id}_street`] || formData[`${id}_street`] || '');
    const [city, setCity] = useState(value?.[`${id}_city`] || formData[`${id}_city`] || '');
    const [province, setProvince] = useState(value?.[`${id}_province`] || formData[`${id}_province`] || '');
    const [postalCode, setPostalCode] = useState(value?.[`${id}_postalCode`] || formData[`${id}_postalCode`] || '');
    
    // Update parent form when any field changes
    useEffect(() => {
      if (onChange) {
        onChange({
          [`${id}_name`]: companyName,
          [`${id}_street`]: street,
          [`${id}_city`]: city,
          [`${id}_province`]: province,
          [`${id}_postalCode`]: postalCode,
        });
      }
    }, [companyName, street, city, province, postalCode]);
    
    return (
      <div className="space-y-3">
        <input 
          type="text" 
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company Name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input 
          type="text" 
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="Street Address"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="text" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input 
            type="text" 
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            placeholder="Province/Territory"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <input 
          type="text" 
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Postal Code"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
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
                <span className="text-sm font-medium">{data.t5PaymentDate ? new Date(data.t5PaymentDate).toLocaleDateString() : 'N/A'}</span>
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
        
        {/* Other information section (if applicable) */}
        {(data.t5OtherInformation && data.t5OtherInformation.length > 0) && (
          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-1">Other Information</h4>
            <div className="border-t border-gray-200 pt-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.t5OtherInformation.includes('t5InterestIncome') && (
                  <div>
                    <div className="text-xs text-gray-500">Box 13 - Interest from Canadian sources</div>
                    <div className="font-medium">${parseFloat(data.t5InterestIncomeAmount || 0).toLocaleString()}</div>
                  </div>
                )}
                {data.t5OtherInformation.includes('t5ForeignIncome') && (
                  <div>
                    <div className="text-xs text-gray-500">Box 15 - Foreign income</div>
                    <div className="font-medium">${parseFloat(data.t5ForeignIncomeAmount || 0).toLocaleString()}</div>
                  </div>
                )}
                {data.t5OtherInformation.includes('t5ForeignTax') && (
                  <div>
                    <div className="text-xs text-gray-500">Box 16 - Foreign tax paid</div>
                    <div className="font-medium">${parseFloat(data.t5ForeignTaxAmount || 0).toLocaleString()}</div>
                  </div>
                )}
                {data.t5OtherInformation.includes('t5CapitalGains') && (
                  <div>
                    <div className="text-xs text-gray-500">Box 18 - Capital gains dividends</div>
                    <div className="font-medium">${parseFloat(data.t5CapitalGainsAmount || 0).toLocaleString()}</div>
                  </div>
                )}
                {data.t5OtherInformation.includes('t5CapitalGainsP1') && (
                  <div>
                    <div className="text-xs text-gray-500">Box 34 - Capital gains dividends - Period 1</div>
                    <div className="font-medium">${parseFloat(data.t5CapitalGainsP1Amount || 0).toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex items-center">
            <RefreshCw size={16} className="mr-2" />
            <span>Calculated values are based on CRA formulas for the {data.t5Year || new Date().getFullYear()} tax year</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Generate T5 slip field mapping
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
        value: formData.t5PaymentDate ? new Date(formData.t5PaymentDate).toLocaleDateString() : 'N/A'
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
          value: `$${eligibleDividends.toLocaleString()}`
        },
        {
          fieldId: 'eligibleDividendsTaxable',
          section: 't5',
          fieldName: 'Taxable Eligible Dividends',
          formLine: 'T5 Box 25 - Taxable amount of eligible dividends',
          value: `$${eligibleTaxable}`,
          details: 'Calculated as 138% of Box 24 (38% gross-up)'
        },
        {
          fieldId: 'eligibleDividendsCredit',
          section: 't5',
          fieldName: 'Eligible Dividends Tax Credit',
          formLine: 'T5 Box 26 - Dividend tax credit for eligible dividends',
          value: `$${eligibleCredit}`,
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
          value: `$${nonEligibleDividends.toLocaleString()}`
        },
        {
          fieldId: 'nonEligibleDividendsTaxable',
          section: 't5',
          fieldName: 'Taxable Non-Eligible Dividends',
          formLine: 'T5 Box 11 - Taxable amount of dividends other than eligible dividends',
          value: `$${nonEligibleTaxable}`,
          details: 'Calculated as 115% of Box 10 (15% gross-up)'
        },
        {
          fieldId: 'nonEligibleDividendsCredit',
          section: 't5',
          fieldName: 'Non-Eligible Dividends Tax Credit',
          formLine: 'T5 Box 12 - Dividend tax credit for dividends other than eligible dividends',
          value: `$${nonEligibleCredit}`,
          details: 'Calculated as 9.0301% of Box 11'
        }
      );
    }
    
    // Add other information fields if selected
    if (formData.t5OtherInformation) {
      if (formData.t5OtherInformation.includes('t5InterestIncome')) {
        t5Mapping.push({
          fieldId: 't5InterestIncomeAmount',
          section: 't5',
          fieldName: 'Interest Income',
          formLine: 'T5 Box 13 - Interest from Canadian sources',
          value: `$${parseFloat(formData.t5InterestIncomeAmount || 0).toLocaleString()}`
        });
      }
      
      if (formData.t5OtherInformation.includes('t5ForeignIncome')) {
        t5Mapping.push({
          fieldId: 't5ForeignIncomeAmount',
          section: 't5',
          fieldName: 'Foreign Income',
          formLine: 'T5 Box 15 - Foreign income',
          value: `$${parseFloat(formData.t5ForeignIncomeAmount || 0).toLocaleString()}`
        });
      }
      
      if (formData.t5OtherInformation.includes('t5ForeignTax')) {
        t5Mapping.push({
          fieldId: 't5ForeignTaxAmount',
          section: 't5',
          fieldName: 'Foreign Tax Paid',
          formLine: 'T5 Box 16 - Foreign tax paid',
          value: `$${parseFloat(formData.t5ForeignTaxAmount || 0).toLocaleString()}`
        });
      }
      
      if (formData.t5OtherInformation.includes('t5CapitalGains')) {
        t5Mapping.push({
          fieldId: 't5CapitalGainsAmount',
          section: 't5',
          fieldName: 'Capital Gains Dividends',
          formLine: 'T5 Box 18 - Capital gains dividends',
          value: `$${parseFloat(formData.t5CapitalGainsAmount || 0).toLocaleString()}`
        });
      }
      
      if (formData.t5OtherInformation.includes('t5CapitalGainsP1')) {
        t5Mapping.push({
          fieldId: 't5CapitalGainsP1Amount',
          section: 't5',
          fieldName: 'Capital Gains Dividends - Period 1',
          formLine: 'T5 Box 34 - Capital gains dividends - Period 1',
          value: `$${parseFloat(formData.t5CapitalGainsP1Amount || 0).toLocaleString()}`
        });
      }
    }
    
    return t5Mapping;
  };
  
  // Get section for current step
  const getSectionForStep = (stepIndex) => {
    if (stepIndex >= filteredSteps.length) return null;
    return filteredSteps[stepIndex].section;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (filteredSteps.length === 0) return 0;
    return Math.min(100, Math.round(((currentStep + 1) / filteredSteps.length) * 100));
  };
  
  // Filter steps based on conditions
  const filteredSteps = steps.filter(step => {
    if (!step.condition) return true;
    return step.condition(formData);
  });
  
  // Navigate to next step
  const nextStep = () => {
    const currentStepData = filteredSteps[currentStep];
    
    // Validate current step if required
    if (currentStepData.required && formData[currentStepData.id] === undefined) {
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
    
    if (currentStep < filteredSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
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
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
  
  // Handle composite company address changes
  const handleCompanyAddressChange = (values) => {
    const updatedFormData = {
      ...formData,
      ...values
    };
    
    // Update state
    setFormData(updatedFormData);
    
    // Save to localStorage after each change
    localStorage.setItem('t2WizardFormData', JSON.stringify(updatedFormData));
    
    // If this includes T5-related fields, update the T5 slip preview
    const hasT5Fields = Object.keys(values).some(key => key.startsWith('t5'));
    if (hasT5Fields) {
      updateT5SlipPreview(updatedFormData);
    }
  };
  
  // Reset form data and localStorage
  const resetFormData = () => {
    setFormData({});
    localStorage.removeItem('t2WizardFormData');
    setCurrentStep(0);
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
  
  // Generate T2 form field mapping (existing function with modifications to include T5 data)
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
          displayValue = new Date(displayValue).toLocaleDateString();
        } else if (step.fieldType === 'currency' && displayValue) {
          displayValue = `$${parseFloat(displayValue).toLocaleString()}`;
        } else if (step.fieldType === 'compositeAddress') {
          // Format composite address fields
          const streetAddress = formData[`${step.id}_street`] || '';
          const city = formData[`${step.id}_city`] || '';
          const province = formData[`${step.id}_province`] || '';
          const postalCode = formData[`${step.id}_postalCode`] || '';
          const country = formData[`${step.id}_country`] || 'Canada';
          
          displayValue = `${streetAddress}, ${city}, ${province}, ${postalCode}, ${country}`;
        }
        
        return {
          fieldId: step.id,
          section: step.section,
          fieldName: step.question,
          formLine: step.formLine,
          value: displayValue
        };
      });
    
    // Add additional calculations here...
    
    return mapping;
  };
  
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
    
    // Find required schedules entry
    const requiredSchedulesField = fieldMapping.find(field => field.fieldId === 'requiredSchedules');
    
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
        {requiredSchedulesField && requiredSchedulesField.details && (
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
                    {requiredSchedulesField.details.map((schedule, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-3 px-4 text-sm text-gray-900">{schedule.schedule}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{schedule.description}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{schedule.reason}</td>
                      </tr>
                    ))}
                    {/* Add T5 row if applicable */}
                    {hasT5Data && (
                      <tr className={requiredSchedulesField.details.length % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
        )}
        
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
  
  // Current step content
  const currentStepData = filteredSteps[currentStep];
  const currentSection = getSectionForStep(currentStep);
  const sectionInfo = sections.find(s => s.id === currentSection) || sections[0];
  
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
      <div className="flex-1 py-8 px-4 md:px-10">
        {/* Mobile Progress Bar */}
        <div className="lg:hidden mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Step {currentStep + 1} of {filteredSteps.length}</span>
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
              <p className="text-sm text-gray-500">Step {currentStep + 1} of {filteredSteps.length}: {currentStepData.title}</p>
            </div>
          </div>
        </div>
        
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
                  value={{
                    [`${currentStepData.id}_name`]: formData[`${currentStepData.id}_name`] || '',
                    [`${currentStepData.id}_street`]: formData[`${currentStepData.id}_street`] || '',
                    [`${currentStepData.id}_city`]: formData[`${currentStepData.id}_city`] || '',
                    [`${currentStepData.id}_province`]: formData[`${currentStepData.id}_province`] || '',
                    [`${currentStepData.id}_postalCode`]: formData[`${currentStepData.id}_postalCode`] || ''
                  }}
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
                                displayValue = new Date(displayValue).toLocaleDateString();
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
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button 
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-5 py-3 rounded-lg flex items-center ${
              currentStep === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200'
            }`}
          >
            <ChevronLeft size={18} className="mr-2" /> Previous
          </button>
          
          <button 
            onClick={nextStep}
            className={`px-5 py-3 rounded-lg flex items-center shadow-sm ${
              currentStep === filteredSteps.length - 1
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {currentStep === filteredSteps.length - 1 ? 'Complete' : 'Next'} 
            {currentStep === filteredSteps.length - 1 ? <Check size={18} className="ml-2" /> : <ChevronRight size={18} className="ml-2" />}
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
  );
};

export default T2Wizard;