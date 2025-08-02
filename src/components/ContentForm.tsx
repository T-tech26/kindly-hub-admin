import { createNewRelease } from '@/lib/actions';
import Image from 'next/image';
import React, { useRef, useState } from 'react'
import { toast } from 'sonner';
import z from 'zod'
import NewsArticle from './NewsArticle';

const contentFormSchema = z.object({
    title: z.string().trim().min(5, 'Title is required'),
    summary: z.string().trim().min(5, 'Summary is required'),
    content: z.string().trim().min(5, 'Please enter the content'),
    image: z.instanceof(File)
            .refine((file) => file.size > 0, { message: "File is required" })
            .refine((file) => file.size <= 5 * 1024 * 1024, { message: "File must be under 5MB" })
            .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
                message: "Only JPEG or PNG files allowed",
            }),
    date: z.string().min(1, 'Please enter a valid date'),
    featured: z.boolean()
});

export type ContentFormData = z.infer<typeof contentFormSchema>

const ContentForm = () => {

    const imgRef = useRef<HTMLInputElement | null>(null);

    const [formData, setFormData] = useState<ContentFormData>({
        title: '',
        summary: '',
        content: '',
        image: new File([], ''), // Initialize with an empty file
        date: '',
        featured: false,
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [preview, setPreview] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if(name === 'image') {
            const input = e.target as HTMLInputElement;
            if(input.files !== null && input.files.length > 0) {
                const file = input.files[0];
                setFormData(prev => ({ ...prev, [name]: file }));
    
                if(file) setPreviewImage(URL.createObjectURL(file))
                return;
            }
        }

        if(name === 'featured') {
            const input = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: input.checked }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handlePublish = () => {
        if (formData.image === null) {
            setFieldErrors(prev => ({ ...prev, image: "File is required" }));
            return;
        }
        handleSubmit(formData);
    };


    const handleSubmit = async (formData: ContentFormData) => {
        
        setLoading(true);
        const result = contentFormSchema.safeParse(formData);

        if (!result.success) {
            const errorObject: Record<string, string> = {};
            // Handle validation errors
            const fieldErrors = result.error.issues;

            fieldErrors.forEach(issue => {
                errorObject[String(issue.path[0])] = issue.message;
            });

            setFieldErrors(errorObject);
            setLoading(false)
            return;
        }

        setFieldErrors({});

        const data = await createNewRelease(result.data);

        if(data.status === 'success') {
            setFormData({
                title: '',
                summary: '',
                content: '',
                image: new File([], ''), // Reset to empty file
                date: '',
                featured: false
            });
            setPreviewImage(null);

            toast.success(data.message);
            setPreview(false);
            setLoading(false);
            return;
        }

        if(data.status === 'error') toast.error(data.error);
        setLoading(false);
    }


  return (
    <section>
        <div className="form-group">
            <label className="form-label">Title <span className="required">*</span></label>
            <input 
                type="text" 
                name='title'
                className="form-input" 
                placeholder="Enter content title" 
                value={formData.title}
                onChange={handleChange}
            />
            {fieldErrors.title && <p className='text-xs text-red-300'>{fieldErrors.title}</p>}
        </div>

        <div className="form-group">
            <label className="form-label">Summary <span className="required">*</span></label>
            <textarea 
                name='summary'
                className="form-input form-textarea" 
                placeholder="Brief summary of the content"
                value={formData.summary}
                onChange={handleChange}
            ></textarea>
            {fieldErrors.summary && <p className='text-xs text-red-300'>{fieldErrors.summary}</p>}
            <div className="help-text">Keep it concise - this will appear in listings and previews</div>
        </div>

        <div className="form-section">
            <h3 className="section-title">
                <span className="section-icon">📄</span>
                Content Details
            </h3>

            <div className="form-group">
                <label className="form-label">Full Content <span className="required">*</span></label>
                <textarea 
                    name='content'
                    value={formData.content}
                    className="form-input form-textarea min-h-[200px]" 
                    placeholder="Write your full content here..." 
                    onChange={handleChange}
                ></textarea>
                {fieldErrors.content && <p className='text-xs text-red-300'>{fieldErrors.content}</p>}
            </div>
        </div>

        <div className="form-section">
            <h3 className="section-title">
                <span className="section-icon">🖼️</span>
                Media & Assets
            </h3>

            <div className="form-group">
                <label className="form-label">Featured Image</label>
                <div className="file-upload" onClick={() => imgRef.current?.click()}>
                    {previewImage ? (
                        <Image
                            src={previewImage}
                            width={100}
                            height={100}
                            alt='featured image'
                            className='size-full'
                        />
                    ) : (
                        <>
                            <div className="upload-icon">📷</div>
                            <div className="upload-text">Click to upload image</div>
                            <div className="upload-subtext">PNG, JPG up to 5MB</div>
                        </>
                    )}
                    <input 
                        ref={imgRef}
                        type="file" 
                        name='image'
                        id="imageUpload" 
                        accept="image/*" 
                        className="display: none;" 
                        onChange={handleChange}
                    />
                </div>
                {fieldErrors.image && <p className='text-xs text-red-300'>{fieldErrors.image}</p>}
            </div>
        </div>

        <div className="form-section">
            <h3 className="section-title">
                <span className="section-icon">📅</span>
                Publishing Options
            </h3>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Publish Date</label>
                    <input 
                        name='date'
                        type="datetime-local" 
                        className="form-input" 
                        value={formData.date} 
                        onChange={handleChange}
                    />
                    {fieldErrors.date && <p className='text-xs text-red-300'>{fieldErrors.date}</p>}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">
                    <input 
                        name='featured'
                        type="checkbox" 
                        className="mr-2" 
                        onChange={handleChange}
                    />
                    Feature on homepage
                </label>
            </div>
        </div>

        <div className="preview-section">
            <div className="preview-title">Preview</div>
            <div className="preview-content">
                {preview ? (
                    <NewsArticle 
                        title={formData.title} 
                        summary={formData.summary} 
                        image={previewImage!} 
                        date={formData.date} />
                ) : (
                    <p>Your content preview will appear here as you type...</p>
                )}
            </div>
        </div>

        <div className="form-actions">
            <button type="button" className="form-btn form-btn-secondary" onClick={() => setPreview(true)}>Preview</button>
            <button 
                type="submit" 
                className="form-btn form-btn-primary"
                onClick={handlePublish}
            >{loading ? 'Publishing...' : 'Publish Now'}</button>
        </div>
    </section>
  )
}

export default ContentForm