import { useDataContext } from '@/context/DataContext';
import { createPaymentMethod } from '@/lib/actions';
import { addBillingLogo } from '@/lib/utils';
import Image from 'next/image';
import React, { useRef, useState } from 'react'
import { toast } from 'sonner';
import z from 'zod'

type PaymentMethodFormProp = {
    type: string
}


const PaymentFormSchema = z.object({
    addressType: z.string().trim().min(1, 'Address type is required'),
    address: z.string().trim().min(5, 'Address is required'),
    logo: z.instanceof(File)
        .refine((file) => file.size > 0, { message: "Logo image is required" })
        .refine((file) => file.size <= 5 * 1024 * 1024, { message: "Logo must be under 5MB" })
        .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
            message: "Only JPEG or PNG files allowed",
        }),
    type: z.string().trim().min(1),
});


export type PaymentMethodFormData = z.infer<typeof PaymentFormSchema>;


const PaymentMethodForm = ({ type }: PaymentMethodFormProp) => {

    const imgRef = useRef<HTMLInputElement>(null);

    const { setBillingData } = useDataContext();

    const [formData, setFormData] = useState<PaymentMethodFormData>({
        addressType: '',
        address: '',
        logo: new File([], ''), // Initialize with an empty file
        type: ''
    });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [preview, setPreview] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if(name === 'logo') {
            const input = e.target as HTMLInputElement;
            if(input.files !== null && input.files.length > 0) {
                const file = input.files[0];
                setFormData(prev => ({ ...prev, [name]: file }));
    
                if(file) setPreviewImage(URL.createObjectURL(file))
                return;
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    }


    const handlePublish = () => {
        if (formData.logo === null) {
            setFieldErrors(prev => ({ ...prev, logo: "File is required" }));
            return;
        }
        handleSubmit(formData);
    };


    const handleSubmit = async (formData: PaymentMethodFormData) => {
        setLoading(true);

        setFormData(prev => ({ ...prev, type}));

        const result = PaymentFormSchema.safeParse(formData);

        if(!result.success) {
            const errorObject: Record<string, string> = {};

            const fieldErrors = result.error.issues;

            fieldErrors.forEach(issue => {
                errorObject[String(issue.path[0])] = issue.message;
            });

            setFieldErrors(errorObject);
            setLoading(false);
            return;
        }

        setFieldErrors({});

        const data = await createPaymentMethod(result.data);

        if(data.status === 'success') {
            setFormData({
                addressType: '',
                address: '',
                logo: new File([], ''), // Reset to empty file
                type: ''
            });

            toast.success(data.message);

            const returnData = data.data?.documents && data.data.logos ? addBillingLogo(data.data?.documents!, data.data?.logos!) : [];

            setBillingData(prev => ([...prev, returnData[0]]));

            setPreviewImage(null);
            setLoading(false);
            setPreview(false);
            return
        }

        if(data.status === 'error') toast.error(data.error);
        setLoading(false);
    }

  return (
    <section>
        <div>
            <div className="form-group">
                <label className="form-label">{type === 'crypto' ? 'Network Type' : 'Address Type'}</label>
                <select className="form-input form-select" name='addressType' value={formData.addressType} onChange={handleChange}>
                    {type === 'paypal' && (
                        <>
                            <option value="">Select category</option>
                            <option value="p-email">PayPal email address</option>
                            <option value="p-username">PayPal username</option>
                            <option value="p-number">PayPal mobile number</option>
                        </>
                    )}

                    {type === 'skrill' && (
                        <>
                            <option value="">Select category</option>
                            <option value="s-email">Skrill email address</option>
                            <option value="s-username">Skrill ID</option>
                            <option value="s-number">Skrill mobile number</option>
                        </>
                    )}

                    {type === 'crypto' && (
                        <>
                            <option value="">Select category</option>
                            <option value="tron">TRC20</option>
                            <option value="bsc">BEP20</option>
                            <option value="ton">Ton</option>
                        </>
                    )}
                </select>
                {fieldErrors.addressType && <p className='text-xs text-red-300'>{fieldErrors.addressType}</p>}
            </div>
        </div>

        <div className="form-group">
            <label className="form-label">
                {formData.addressType === 'p-email' ? 'PayPal Email'
                    : formData.addressType === 'p-username' ? 'PayPal Username'
                        : formData.addressType === 'p-number' ? 'PayPal Mobile Number'
                            : formData.addressType === 's-email' ? 'Skrill Email'
                                : formData.addressType === 's-username' ? 'Skrill ID'
                                    : formData.addressType === 's-number' ? 'Skrill Mobile Number'
                                        : formData.addressType === 'tron' ? 'TRC20 Address'
                                            : formData.addressType === 'bsc' ? 'BEP20 Address'
                                                : formData.addressType === 'ton' ? 'Ton Address'
                                                    : 'Address'
                } <span className="required">*</span>
            </label>
            <input 
                type="text" 
                name='address'
                value={formData.address}
                className="form-input" 
                placeholder={
                    formData.addressType === 'p-email' ? 'Enter PayPal email'
                    : formData.addressType === 'p-username' ? 'Enter PayPal username'
                        : formData.addressType === 'p-number' ? 'Enter PayPal mobile number'
                            : formData.addressType === 's-email' ? 'Enter Skrill email'
                                : formData.addressType === 's-username' ? 'Enter Skrill ID'
                                    : formData.addressType === 's-number' ? 'Enter Skrill mobile number'
                                        : formData.addressType === 'tron' ? 'Enter TRC20 address'
                                            : formData.addressType === 'bsc' ? 'Enter BEP20 address'
                                                : formData.addressType === 'ton' ? 'Enter Ton address'
                                                    : 'Enter address'
                } 
                onChange={handleChange}
            />
            {fieldErrors.address && <p className='text-xs text-red-300'>{fieldErrors.address}</p>}
        </div>

        <div className="form-section">
            <h3 className="section-title">
                <span className="section-icon">🖼️</span>
                Method Logo
            </h3>

            <div className="form-group">
                <label className="form-label">Logo Image</label>
                <div className="file-upload" onClick={() => imgRef.current?.click()}>
                    {previewImage ? (
                        <img 
                            src={previewImage} 
                            width={100}
                            height={100}
                            alt="Preview" 
                            className="size-full"
                        />
                    ) : (
                        <div className="upload-placeholder">
                            <div className="upload-icon">📷</div>
                            <div className="upload-text">Click to upload image</div>
                            <div className="upload-subtext">PNG, JPG up to 5MB</div>
                        </div>
                    )}
                
                    <input 
                        ref={imgRef}
                        type="file" 
                        name='logo'
                        id="imageUpload" 
                        accept="image/*" 
                        className="display: none;" 
                        onChange={handleChange}
                    />
                    {fieldErrors.logo && <p className='text-xs text-red-300'>{fieldErrors.logo}</p>}
                </div>
            </div>
        </div>

        <div className="preview-section">
            <div className="preview-title">Preview</div>
            <div className="preview-content"> 
                {preview ? (
                    <div className='flex flex-col gap-2'>
                        <Image
                            src={previewImage!}
                            width={100}
                            height={100}
                            alt='Payment Method Logo'
                            className='size-full'
                        />

                        <p className='text-[#666] text-sm flex items-center justify-between'>Address Type <span>{
                            formData.addressType === 'p-email' ? 'PayPal email'
                                : formData.addressType === 'p-username' ? 'PayPal username'
                                    : formData.addressType === 'p-number' ? 'PayPal mobile number'
                                        : formData.addressType === 's-email' ? 'Skrill email'
                                            : formData.addressType === 's-username' ? 'Skrill ID'
                                                : formData.addressType === 's-number' ? 'Skrill mobile number'
                                                    : formData.addressType === 'tron' ? 'TRC20 address'
                                                        : formData.addressType === 'bsc' ? 'BEP20 address'
                                                            : formData.addressType === 'ton' ? 'Ton address'
                                                                : 'Address'
                        }</span></p>
                        <p className='text-[#666] text-sm flex items-center justify-between'>Email <span>{formData.address}</span></p>
                    </div>
                ) : (
                    <p>Your content preview will appear here as you type...</p>
                )}
            </div>
        </div>

        <div className="form-actions">
            <button type="button" className="form-btn form-btn-secondary" onClick={() => setPreview(!preview)}>Preview</button>
            <button type="submit" className="form-btn form-btn-primary" onClick={handlePublish}>
                {loading ? 'Uploading...' : 'Upload Payment Method'}
            </button>
        </div>
    </section>
  )
}

export default PaymentMethodForm