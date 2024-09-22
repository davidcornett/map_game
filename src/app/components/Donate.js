import React from 'react';
import Script from 'next/script';

const BuyMeACoffeeWidget = () => {
  return (
    <>
      <Script
        data-name="BMC-Widget"
        data-cfasync="false"
        src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        data-id="bordercanvas"
        data-description="Support me on Buy me a coffee!"
        data-message=""
        data-color="#5F7FFF"
        data-position="Right"
        data-x_margin="18"
        data-y_margin="18"
        strategy="afterInteractive"
      />
    </>
  );
};

export default BuyMeACoffeeWidget;