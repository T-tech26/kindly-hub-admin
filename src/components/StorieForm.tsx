import { createSuccessStory } from '@/lib/actions';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    testimonial: z.string().min(1, "Testimonial is required"),
});

export type FormData = z.infer<typeof formSchema>;

const StorieForm = () => {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        testimonial: ''
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (formData: FormData) => {

        setLoading(true)
        const result = formSchema.safeParse(formData);
        
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

        setFieldErrors({}); // Clear previous errors if validation passes
        
        // Submit the form
        const data = await createSuccessStory(formData);
        
        if(data.status === 'info') {
            setFormData({
                name: '',
                description: '',
                testimonial: ''
            });
            toast.success(data.message);
            setLoading(false);
            setPreview(false);
            return
        }
        if(data.status === 'error') toast.error(data.error);
        setLoading(false);
    };

  return (
    <section>
        <div className="form-group">
            <label className="form-label">Name <span className="required">*</span></label>
            <input 
                type="text" 
                name='name'
                className="form-input" 
                placeholder="Enter name" 
                onChange={handleChange} 
                value={formData.name}
            />
            {fieldErrors.name && <p className="text-xs text-red-300">{fieldErrors.name}</p>}
        </div>

        <div className="form-group">
            <label className="form-label">Description <span className="required">*</span></label>
            <input 
                type="text" 
                name='description'
                className="form-input" 
                placeholder="Enter person's description" 
                onChange={handleChange} 
                value={formData.description}
            />
            {fieldErrors.description && <p className="text-xs text-red-300">{fieldErrors.description}</p>}
        </div>

        <div className="form-group">
            <label className="form-label">Testimonial <span className="required">*</span></label>
            <textarea 
                name='testimonial'
                className="form-input form-textarea" 
                placeholder="Brief summary of testimony" 
                onChange={handleChange} 
                value={formData.testimonial}
            ></textarea>
            {fieldErrors.testimonial && <p className="text-xs text-red-300">{fieldErrors.testimonial}</p>}
            <div className="help-text">Keep it concise - this will appear in listings and previews</div>
        </div>

        <div className="preview-section">
            <div className="preview-title">Preview</div>
            <div className="preview-content">
                {preview ? (
                    <div className="story-card">
                        <blockquote>{formData.testimonial}</blockquote>
                        <p className="story-author">—{formData.name}, {formData.description}</p>
                    </div>
                ) : (
                    <p>Your content preview will appear here as you type...</p>
                )}
            </div>
        </div>

        <div className="form-actions">
            <button type="button" className="form-btn form-btn-secondary" onClick={() => setPreview(!preview)}>Preview</button>
            <button type="submit" className="form-btn form-btn-primary" 
                onClick={() => handleSubmit(formData)}
                disabled={loading}
            >{loading ? 'Publishing...' : 'Publish Now'}</button>
        </div>
    </section>
  )
}

export default StorieForm