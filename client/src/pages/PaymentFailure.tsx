
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, Home, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentFailure = () => {
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    // Extract error details from URL parameters or other sources
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error') || 'Payment processing failed. Please try again.';
    setErrorDetails(error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-700">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            Unfortunately, your payment could not be processed at this time.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm font-medium text-red-800 mb-2">Error Details:</p>
            <p className="text-sm text-red-700 break-words">
              {errorDetails}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="w-full border-red-300 text-red-700 hover:bg-red-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Link to="/">
              <Button className="w-full bg-gray-600 hover:bg-gray-700">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailure;
