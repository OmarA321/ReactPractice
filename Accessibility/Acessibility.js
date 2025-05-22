const { useState, useEffect, useRef } = React;

// Form with accessibility features
function AccessibleForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    //validation test for form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.age.trim()) {
            newErrors.age = 'Age is required';
        } else if (isNaN(formData.age) || formData.age < 1) {
            newErrors.age = 'Please enter a valid age';
        }
        
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSubmitStatus('error');
            // Focus first error field
            const firstErrorField = Object.keys(newErrors)[0];
            document.querySelector(`[name="${firstErrorField}"]`).focus();
        } else {
            setErrors({});
            setSubmitStatus('success');
            setFormData({ name: '', email: '', age: '', message: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
                <label htmlFor="name">
                    Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                    <div id="name-error" className="error-message" role="alert">
                        {errors.name}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="email">
                    Email Address *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                    <div id="email-error" className="error-message" role="alert">
                        {errors.email}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="age">
                    Age *
                </label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={errors.age ? 'true' : 'false'}
                    aria-describedby={errors.age ? 'age-error' : undefined}
                    min="1"
                />
                {errors.age && (
                    <div id="age-error" className="error-message" role="alert">
                        {errors.age}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="message">
                    Message (Optional)
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    aria-describedby="message-help"
                />
                <div id="message-help" className="form-help">
                    Share any additional thoughts or feedback
                </div>
            </div>

            <button type="submit" className="btn">
                Submit Form
            </button>

            {submitStatus === 'success' && (
                <div className="status-container status-success" role="alert" aria-live="polite">
                    Form submitted successfully!
                </div>
            )}
            
            {submitStatus === 'error' && (
                <div className="status-container status-error" role="alert" aria-live="assertive">
                    Please fix the errors above and try again.
                </div>
            )}
        </form>
    );
}

//to help with accesssibility keyboard shortcuts
function AccessibleModal() {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            modalRef.current && modalRef.current.focus();
            
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
                
                if (e.key === 'Tab') {
                    const focusableElements = modalRef.current.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen]);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        triggerRef.current && triggerRef.current.focus();
    };

    return (
        <>
            <button ref={triggerRef} onClick={openModal} className="btn">
                Open Modal
            </button>
            
            {isOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div 
                        className="modal" 
                        onClick={(e) => e.stopPropagation()}
                        ref={modalRef}
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    >
                        <button 
                            className="modal-close" 
                            onClick={closeModal}
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                        
                        <h3 id="modal-title">Accessible Modal</h3>
                        <p id="modal-description">
                            This modal demonstrates proper focus management, keyboard navigation, 
                            and ARIA attributes for accessibility.
                        </p>
                        <p>
                            Try navigating with Tab and Shift+Tab. Press Escape to close.
                        </p>
                        
                        <div style={{marginTop: '1rem'}}>
                            <button className="btn" onClick={closeModal}>
                                Close Modal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Live region demonstration
function LiveRegionDemo() {
    const [count, setCount] = useState(0);
    const [status, setStatus] = useState('');

    const increment = () => {
        setCount(prev => prev + 1);
        setStatus(`Count increased to ${count + 1}`);
    };

    const decrement = () => {
        setCount(prev => prev - 1);
        setStatus(`Count decreased to ${count - 1}`);
    };

    return (
        <div>
            <p>Current count: <strong>{count}</strong></p>
            <div>
                <button onClick={increment} className="btn">
                    Increase (+)
                </button>
                <button onClick={decrement} className="btn btn-secondary">
                    Decrease (-)
                </button>
            </div>
            
            {/* Live region for screen readers */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {status}
            </div>
            
            {status && (
                <div className="status-container status-info">
                    {status}
                </div>
            )}
        </div>
    );
}

// Main accessibility demonstration component
function AccessibilityApp() {
    return (
        <div className="accessibility-container">
            <section className="accessibility-section">
                <h2>Accessibility Features Demo</h2>
                <p>
                    This page demonstrates various accessibility features implemented with React.
                    Try navigating with keyboard only (Tab, Shift+Tab, Enter, Space, Escape).
                </p>
            </section>

            <section className="accessibility-section">
                <h3>Accessible Form</h3>
                <p>This form includes proper labels, error handling, and ARIA attributes:</p>
                <AccessibleForm />
            </section>

            <section className="accessibility-section">
                <h3>Modal with Focus Management</h3>
                <p>This modal traps focus and manages keyboard navigation:</p>
                <AccessibleModal />
            </section>

            <section className="accessibility-section">
                <h3>Live Regions</h3>
                <p>Screen readers will announce changes to the count:</p>
                <LiveRegionDemo />
            </section>

            <section className="accessibility-section">
                <h3>Keyboard Navigation Tips</h3>
                <ul>
                    <li><strong>Tab:</strong> Move to next interactive element</li>
                    <li><strong>Shift + Tab:</strong> Move to previous interactive element</li>
                    <li><strong>Enter/Space:</strong> Activate buttons and links</li>
                    <li><strong>Escape:</strong> Close modals and dropdowns</li>
                    <li><strong>Arrow keys:</strong> Navigate within components</li>
                </ul>
            </section>
        </div>
    );
}

// Render the app
ReactDOM.render(<AccessibilityApp />, document.getElementById('accessibility-app'));