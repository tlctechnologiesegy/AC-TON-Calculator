// Unit conversion constants
const CONVERSION = {
    LENGTH: {
        TO_METRIC: 0.3048,    // feet to meters
        TO_IMPERIAL: 3.28084  // meters to feet
    },
    TEMPERATURE: {
        TO_METRIC: value => (value - 32) * 5/9,    // F to C
        TO_IMPERIAL: value => (value * 9/5) + 32    // C to F
    }
};

// Updated comprehensive country settings
const COUNTRY_SETTINGS = {
    AF: { name: 'Afghanistan (Metric)', metric: true },
    AL: { name: 'Albania (Metric)', metric: true },
    DZ: { name: 'Algeria (Metric)', metric: true },
    AR: { name: 'Argentina (Metric)', metric: true },
    AU: { name: 'Australia (Metric)', metric: true },
    AT: { name: 'Austria (Metric)', metric: true },
    BH: { name: 'Bahrain (Metric)', metric: true },
    BD: { name: 'Bangladesh (Metric)', metric: true },
    BE: { name: 'Belgium (Metric)', metric: true },
    BR: { name: 'Brazil (Metric)', metric: true },
    CA: { name: 'Canada (Metric)', metric: true },
    CN: { name: 'China (Metric)', metric: true },
    DK: { name: 'Denmark (Metric)', metric: true },
    EG: { name: 'Egypt (Metric)', metric: true },
    FI: { name: 'Finland (Metric)', metric: true },
    FR: { name: 'France (Metric)', metric: true },
    DE: { name: 'Germany (Metric)', metric: true },
    GR: { name: 'Greece (Metric)', metric: true },
    IN: { name: 'India (Metric)', metric: true },
    ID: { name: 'Indonesia (Metric)', metric: true },
    IR: { name: 'Iran (Metric)', metric: true },
    IQ: { name: 'Iraq (Metric)', metric: true },
    IE: { name: 'Ireland (Metric)', metric: true },
    IL: { name: 'Israel (Metric)', metric: true },
    IT: { name: 'Italy (Metric)', metric: true },
    JP: { name: 'Japan (Metric)', metric: true },
    JO: { name: 'Jordan (Metric)', metric: true },
    KW: { name: 'Kuwait (Metric)', metric: true },
    LB: { name: 'Lebanon (Metric)', metric: true },
    LY: { name: 'Libya (Metric)', metric: true },
    MY: { name: 'Malaysia (Metric)', metric: true },
    MM: { name: 'Myanmar (Imperial)', metric: false },
    NL: { name: 'Netherlands (Metric)', metric: true },
    NZ: { name: 'New Zealand (Metric)', metric: true },
    NG: { name: 'Nigeria (Metric)', metric: true },
    NO: { name: 'Norway (Metric)', metric: true },
    OM: { name: 'Oman (Metric)', metric: true },
    PK: { name: 'Pakistan (Metric)', metric: true },
    PH: { name: 'Philippines (Metric)', metric: true },
    PL: { name: 'Poland (Metric)', metric: true },
    PT: { name: 'Portugal (Metric)', metric: true },
    QA: { name: 'Qatar (Metric)', metric: true },
    SA: { name: 'Saudi Arabia (Metric)', metric: true },
    SG: { name: 'Singapore (Metric)', metric: true },
    ZA: { name: 'South Africa (Metric)', metric: true },
    KR: { name: 'South Korea (Metric)', metric: true },
    ES: { name: 'Spain (Metric)', metric: true },
    LK: { name: 'Sri Lanka (Metric)', metric: true },
    SE: { name: 'Sweden (Metric)', metric: true },
    CH: { name: 'Switzerland (Metric)', metric: true },
    SY: { name: 'Syria (Metric)', metric: true },
    TW: { name: 'Taiwan (Metric)', metric: true },
    TH: { name: 'Thailand (Metric)', metric: true },
    TR: { name: 'Turkey (Metric)', metric: true },
    AE: { name: 'UAE (Metric)', metric: true },
    UK: { name: 'United Kingdom (Metric)', metric: true },
    US: { name: 'United States (Imperial)', metric: false },
    VN: { name: 'Vietnam (Metric)', metric: true },
    YE: { name: 'Yemen (Metric)', metric: true }
};

// Populate country list when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('country');
    const countries = Object.entries(COUNTRY_SETTINGS)
        .sort((a, b) => a[1].name.localeCompare(b[1].name));
    
    // Clear existing options except the first placeholder
    countrySelect.innerHTML = '<option value="">Please select your country</option>';
    
    // Add sorted countries
    countries.forEach(([code, data]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = data.name;
        countrySelect.appendChild(option);
    });
});

// Update units when country changes
document.getElementById('country').addEventListener('change', function(e) {
    const country = e.target.value;
    const isMetric = COUNTRY_SETTINGS[country].metric;
    const unitLabels = document.querySelectorAll('.unit-label');
    
    unitLabels.forEach(label => {
        label.textContent = isMetric ? label.dataset.metric : label.dataset.imperial;
    });
});

document.getElementById('hvacForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const country = document.getElementById('country').value;
    const isMetric = COUNTRY_SETTINGS[country].metric;
    
    // Get form values and convert if necessary
    let length = parseFloat(document.getElementById('length').value);
    let width = parseFloat(document.getElementById('width').value);
    let height = parseFloat(document.getElementById('height').value);
    
    // Convert metric measurements to imperial for calculations
    if (isMetric) {
        length *= CONVERSION.LENGTH.TO_IMPERIAL;
        width *= CONVERSION.LENGTH.TO_IMPERIAL;
        height *= CONVERSION.LENGTH.TO_IMPERIAL;
    }

    const windows = parseInt(document.getElementById('windows').value);
    const doors = parseInt(document.getElementById('doors').value);
    const occupants = parseInt(document.getElementById('occupants').value);
    const floor = document.getElementById('floor').value;
    const insulation = document.getElementById('insulation').value;
    const sunExposure = document.getElementById('sunExposure').value;
    const furniture = document.getElementById('furniture').value;

    // Calculate room volume
    const volume = length * width * height;
    
    // Base BTU calculation (20 BTU per cubic foot)
    let btuRequired = volume * 20;

    // Adjustments based on factors
    const adjustments = {
        windows: windows * 1000,
        doors: doors * 500,
        occupants: occupants * 400,
        floor: floor === 'top' ? btuRequired * 0.1 : 0,
        sunExposure: sunExposure === 'allday' ? btuRequired * 0.1 : 
                    sunExposure === 'afternoon' ? btuRequired * 0.05 : 0
    };

    // Furniture load factors
    const furnitureLoad = {
        'minimal': 0,
        'wooden': btuRequired * 0.05,
        'metal': btuRequired * 0.08,
        'mixed': btuRequired * 0.06
    };

    // Apply insulation factors
    const insulationFactor = {
        'poor': 1.2,
        'average': 1.0,
        'good': 0.8
    };

    // Calculate total BTU
    const totalBTU = (btuRequired + Object.values(adjustments).reduce((a, b) => a + b, 0) + furnitureLoad[furniture]) 
                     * insulationFactor[insulation];

    // Convert to tons (12000 BTU = 1 ton)
    const tons = totalBTU / 12000;
    
    // Calculate current draw (rough estimate: 7 amps per ton)
    const current = tons * 7;

    // Display results with appropriate units
    document.getElementById('results').style.display = 'block';
    document.getElementById('tonnage').innerHTML = `
        <strong>Required Tonnage:</strong> ${tons.toFixed(2)} tons<br>
        <strong>Cooling Capacity:</strong> ${(tons * 3.517).toFixed(2)} kW
    `;
    
    document.getElementById('current').innerHTML = `
        <strong>Estimated Current Draw:</strong><br>
        Per minute: ${(current).toFixed(2)} amps<br>
        Per hour: ${(current * 60).toFixed(2)} amps<br>
        Per day: ${(current * 1440).toFixed(2)} amps
    `;
    
    document.getElementById('daily').innerHTML = `
        <strong>BTU Load:</strong> ${totalBTU.toFixed(0)} BTU/hr<br>
        <strong>Kilowatt Load:</strong> ${(totalBTU * 0.000293071).toFixed(2)} kW
    `;
});

// Add helper function for unit conversion display
function formatMeasurement(value, unit, isMetric) {
    if (unit === 'length') {
        return isMetric ? 
            `${(value * CONVERSION.LENGTH.TO_METRIC).toFixed(2)} m` : 
            `${value.toFixed(2)} ft`;
    }
    // Add more unit conversions as needed
    return value;
}
