import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { Loader2, XIcon } from 'lucide-react'
import { GlobalState } from '../objects/GlobalState';
import { toast } from 'sonner';

interface CouponProps {
  globalState: GlobalState;
}

export const Coupon: React.FC<CouponProps> = ({ globalState }) => {
  const {
    api, returnDateTime, setPrice,
    vehicleOption,
    startDestination, endDestination,
    coupons, setCoupons
  } = globalState;

  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (coupon.trim() !== '') {
      setLoading(true); // Set loading to true when API call starts
      try {
        const response = await fetch(`${api}/apply_coupon.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startId: startDestination?.place_id ?? null,
            endId: endDestination?.place_id ?? null,
            optionId: vehicleOption?.id ?? null,
            returnDate: returnDateTime?.toISOString() ?? null,
            coupons: [...coupons, coupon].join(','),
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.status === "success") {
            toast.success("Coupon added", {
              description: data.message,
            });

            setCoupons([...coupons, coupon]);
            setCoupon('');
            
            const updatedPrice = data.price;
            setPrice(updatedPrice);
          } else {
            if (coupons.length == 0){
              toast.error("Oops! Something didn't go as planned", {
                description: data.message,
             });
            }else{
              toast.error("Oops! Something didn't go as planned", {
                description: data.message,
             });
            }
          }
        }else{
          throw new Error('Connection error');
        }
      } catch (error) {
        toast.error("Oops! Something didn't go as planned", {
          description: "There was a problem with your request.",
        });
      }finally {
        setLoading(false); // Set loading back to false after API call completes
      }
    }
  };

  const handleRemoveCoupon = async (index: number) => {
    const updatedCoupons = coupons.filter((_, i) => i !== index);
    setCoupons(updatedCoupons);

    try {
      const response = await fetch(`${api}/apply_coupon.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startId: startDestination?.place_id ?? null,
          endId: endDestination?.place_id ?? null,
          optionId: vehicleOption?.id ?? null,
          returnDate: returnDateTime?.toISOString() ?? null,
          coupons: [...updatedCoupons].join(','),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          const updatedPrice = data.price;
          setPrice(updatedPrice);
        } else {
          toast.error("Oops! Something didn't go as planned", {
            description: data.message,
          });
        }
      }else{
        throw new Error('Connection error');
      }
    } catch (error) {
      toast.error("Oops! Something didn't go as planned", {
        description: "There was a problem with your request.",
      });
    }
  };

  return (
    <div>
      <div className='flex space-x-4'>
        <Input
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Enter coupon code"
        />
       <Button onClick={handleApplyCoupon} className="p-4 w-40 rounded-md flex items-center justify-center gap-2 bg-primary text-white">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Applying...</span>
            </>
          ) : (
            <span>Apply</span>
          )}
        </Button>
      </div>
      <div className='flex flex-wrap flex-row gap-2 my-2'>
        {coupons.length > 0 && coupons.map((appliedCoupon, index) => (
          <div key={index} className="flex justify-center items-center space-x-1 bg-gray-100 p-2 rounded-md">
            <span>{appliedCoupon}</span>
            <XIcon width={16} className='cursor-pointer' onClick={() => handleRemoveCoupon(index)} />
          </div>
        ))}
      </div>
    </div>
  );
};
