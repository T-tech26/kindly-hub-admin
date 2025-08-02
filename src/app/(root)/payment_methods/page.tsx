'use client'

import Header from '@/components/Header'
import PaymentMethodForm from '@/components/PaymentMethodForm';
import { useDataContext } from '@/context/DataContext';
import { deletePaymentMethod, getAllPaymentMethods } from '@/lib/actions';
import { addBillingLogo } from '@/lib/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';


const Page = () => {

  const { billingData, setBillingData } = useDataContext();

  const [type, setType] = useState('paypal');
  const [method, setMethod] = useState('card');
  const [paypal, setPaypal] = useState<PaymentMethodType[]>([]);
  const [skrill, setSkrill] = useState<PaymentMethodType[]>([]);
  const [crypto, setCrypto] = useState<PaymentMethodType[]>([]);

  useEffect(() => {
    const paypalArray = billingData.filter(data => data.type === 'paypal');
    const skrillArray = billingData.filter(data => data.type === 'skrill');
    const cryptoArray = billingData.filter(data => data.type === 'crypto');

    setPaypal(paypalArray);
    setSkrill(skrillArray);
    setCrypto(cryptoArray);
  }, [billingData]);


  const handleDelete = async (data: PaymentMethodType) => {
    const returnData = await deletePaymentMethod(data);

    if(returnData.status === 'success') {
      toast.success(returnData.message);

      const updatedPaymentMethod = await getAllPaymentMethods();

      const addLogo = addBillingLogo(updatedPaymentMethod.documents, updatedPaymentMethod.logos);

      setBillingData(addLogo);
      return;
    }

    if(returnData.status === 'error') toast.error(returnData.error);
  }


  return (
    <section className="flex-1 overflow-y-scroll">
      <Header title="Billings" />

      <div className="p-8">
          <div>
            <div className="billing-form-header">
                <h2 className="form-title">Manage Payment Methods</h2>
                <p className="form-subtitle">Add or delete payment methods</p>
            </div>
            
            <div className="flex flex-col items-start justify-between lg:flex-row gap-5 mt-5">

              <div className='w-full lg:w-[70%] rounded-lg shadow-[0_2px_4px_rgb(0,0,0,0.1)] bg-white'>
                <div className="p-[30px]">
                    <div className="content-type-tabs">
                        <button className={`tab-button ${type === 'paypal' ? 'active' : ''}`} onClick={() => setType('paypal')}>PayPal</button>
                        <button className={`tab-button ${type === 'skrill' ? 'active' : ''}`} onClick={() => setType('skrill')}>Skrill</button>
                        <button className={`tab-button ${type === 'crypto' ? 'active' : ''}`} onClick={() => setType('crypto')}>Crypto</button>
                    </div>
                </div>

                <form id="contentForm" onSubmit={(e) => e.preventDefault()}>
                  <div className="p-[30px]">
                      <h3 className="section-title">
                        <span className="section-icon">📝</span>
                        {type === 'paypal' && ('PayPal Form')}
                        {type === 'skrill' && ('Skrill Form')}
                        {type === 'crypto' && ('Crypto Form')}
                      </h3>

                      {type === 'paypal' && (<PaymentMethodForm type='paypal' />)}
                      {type === 'skrill' && (<PaymentMethodForm type='skrill' />)}
                      {type === 'crypto' && (<PaymentMethodForm type='crypto' />)}
                  </div>
                </form>
              </div>

              <div className="sidebar-content w-full lg:w-[30%]">
                <h3>Payment Methods</h3>
                <div className="payment-methods">
                    <button 
                      className={`payment-method ${method === 'card' ? 'active' : 'btn'}`}
                      onClick={() => setMethod('card')}
                    >
                      Credit Card
                    </button>
                    <button 
                      className={`payment-method ${method === 'paypal' ? 'active' : 'btn'}`}
                      onClick={() => setMethod('paypal')}
                    >
                      PayPal
                    </button>
                    <button 
                      className={`payment-method ${method === 'skrill' ? 'active' : 'btn'}`}
                      onClick={() => setMethod('skrill')}
                    >
                      Skrill
                    </button>
                    <button 
                      className={`payment-method ${method === 'crypto' ? 'active' : 'btn'}`}
                      onClick={() => setMethod('crypto')}
                    >
                      Crypto
                    </button>
                </div>

                {method === 'card' && (
                    <Image
                      src='/hope-bridge-logo.png'
                      width={200}
                      height={200}
                      alt='paypal logo'
                      className='w-auto h-auto'
                    />
                )}

                <div className='flex flex-col gap-5'>
                  {method === 'paypal' && paypal.length > 0 && (
                    <>
                      {paypal.map((data, index) => (
                        <div className='flex flex-col gap-2 rounded-lg shadow-[0_2px_4px_rgb(0,0,0,0.1)] p-3' key={index}>
                          <Image
                            src={data.logo}
                            width={100}
                            height={100}
                            alt='paypal logo'
                          />

                          <p className='text-[#666] text-sm flex items-center justify-between'>Address Type <span>
                            {
                              data.addressType === 'p-email' ? 'Email'
                                : data.addressType === 'p-username' ? 'PayPal username'
                                  : 'Mobile number'
                            }
                          </span></p>
                          <p className='text-[#666] text-sm flex items-center justify-between'>Email <span>{data.address}</span></p>

                          <Image
                            src='/delete-icon.svg'
                            width={30}
                            height={30}
                            alt='delete icon'
                            className='cursor-pointer'
                            onClick={() => handleDelete(data)}
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {method === 'skrill' && skrill.length > 0 && (
                    <>
                      {skrill.map((data, index) => (
                        <div className='flex flex-col gap-2 rounded-lg shadow-[0_2px_4px_rgb(0,0,0,0.1)] p-3' key={index}>
                          <Image
                            src={data.logo}
                            width={100}
                            height={100}
                            alt='skrill logo'
                          />

                          <p className='text-[#666] text-sm flex items-center justify-between'>Address Type <span>
                            {
                              data.addressType === 's-email' ? 'Email'
                                : data.addressType === 's-username' ? 'Skrill ID'
                                  : 'Mobile number'
                            }  
                          </span></p>
                          <p className='text-[#666] text-sm flex items-center justify-between'>Email <span>{data.address}</span></p>

                          <Image
                            src='/delete-icon.svg'
                            width={30}
                            height={30}
                            alt='delete icon'
                            className='cursor-pointer'
                            onClick={() => handleDelete(data)}
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {method === 'crypto' && crypto.length > 0 && (
                    <>
                      {crypto.map((data, index) => (
                        <div className='flex flex-col gap-2 rounded-lg shadow-[0_2px_4px_rgb(0,0,0,0.1)] p-3' key={index}>
                          <Image
                            src={data.logo}
                            width={100}
                            height={100}
                            alt='crypto logo'
                          />
      
                          <p className='text-[#666] text-sm flex items-center justify-between'>Network Type <span>
                            {
                              data.addressType === 'tron' ? 'TRC20'
                                : data.addressType === 'bsc' ? 'BEP20'
                                  : 'Ton'
                            }
                          </span></p>
                          <p className='text-[#666] text-sm flex items-center justify-between text-wrap'>Address <span>{data.address.length > 20 ? `${data.address.slice(0, 20)}...` : data.address}</span></p>
      
                          <Image
                            src='/delete-icon.svg'
                            width={30}
                            height={30}
                            alt='delete icon'
                            className='cursor-pointer'
                            onClick={() => handleDelete(data)}
                          />
                        </div>
                      ))}
                    </>
                    )}
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Page