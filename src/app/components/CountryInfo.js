const CountryInfo = ({ newCountryStats }) => {
    return (
    <div style={{
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    backgroundColor: '#f9f9f9',
    color: '#333',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid rgba(0,0,0,0.1)',
    fontSize: '14px',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    zIndex: 1000,
    width: '250px', // Increased width
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    }}>
    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        New Country Demographics
    </div>
    <div style={{ fontSize: '12px' }}>
        <div>
            Total Population: <span style={{ fontWeight: 'normal' }}>{newCountryStats.total_population.toLocaleString()}</span>
        </div>
        <div>
            Black Population: <span style={{ fontWeight: 'normal' }}>{Math.round(newCountryStats.pop_black * 100)}%</span>
        </div>
        <div>
            White Population: <span style={{ fontWeight: 'normal' }}>{Math.round(newCountryStats.pop_white * 100)}%</span>
        </div>
        <div>
            Hispanic Population: <span style={{ fontWeight: 'normal' }}>{Math.round(newCountryStats.pop_hispanic * 100)}%</span>
        </div>
        <div>
            Asian Population: <span style={{ fontWeight: 'normal' }}>{Math.round(newCountryStats.pop_asian * 100)}%</span>
        </div>
        <div>
            Native American Population: <span style={{ fontWeight: 'normal' }}>{Math.round(newCountryStats.pop_native * 100)}%</span>
        </div>
        <div>
            Pacific Islander Population: <span style={{ fontWeight: 'normal' }}>{Math.round(newCountryStats.pop_pac_isl * 100)}%</span>
        </div>
        <div>
            Two+ Race Population: <span style={{ fontWeight: 'normal' }}>{Math.round(newCountryStats.pop_two_plus * 100)}%</span>
        </div>
    </div>

    </div>
    );
    }
export default CountryInfo;
