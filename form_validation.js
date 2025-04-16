// تحسين نموذج الاتصال لموقع Linko مع Formspree

document.addEventListener('DOMContentLoaded', function() {
    // الحصول على نموذج الاتصال
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        // إضافة معالج الأحداث لتقديم النموذج
        contactForm.addEventListener('submit', function(e) {
            // لا نمنع السلوك الافتراضي هنا لأننا نريد أن يرسل Formspree البيانات
            
            // إظهار مؤشر التحميل
            const loadingIndicator = document.querySelector('.form-loading');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'flex';
            }
            
            // التحقق من صحة البيانات المدخلة
            if (!validateForm()) {
                e.preventDefault(); // منع الإرسال إذا كان النموذج غير صالح
                
                // إخفاء مؤشر التحميل إذا فشل التحقق
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
            }
            
            // تخزين بيانات النموذج في التخزين المحلي للاستخدام المستقبلي
            if (window.localStorage) {
                localStorage.setItem('linko_form_name', document.getElementById('name').value);
                localStorage.setItem('linko_form_email', document.getElementById('email').value);
                localStorage.setItem('linko_form_phone', document.getElementById('phone').value);
            }
        });
        
        // إضافة مستمعي أحداث للتحقق من الإدخال في الوقت الفعلي
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                // إزالة رسائل الخطأ عند الكتابة
                const errorElement = this.parentElement.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                    this.classList.remove('invalid');
                }
            });
        });
        
        // استعادة البيانات المخزنة سابقًا إذا كانت متوفرة
        if (window.localStorage) {
            const savedName = localStorage.getItem('linko_form_name');
            const savedEmail = localStorage.getItem('linko_form_email');
            const savedPhone = localStorage.getItem('linko_form_phone');
            
            if (savedName) document.getElementById('name').value = savedName;
            if (savedEmail) document.getElementById('email').value = savedEmail;
            if (savedPhone) document.getElementById('phone').value = savedPhone;
        }
    }
});

// التحقق من صحة النموذج بالكامل
function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const serviceInput = document.getElementById('service');
    const messageInput = document.getElementById('message');
    
    let isValid = true;
    
    // التحقق من كل حقل
    if (!validateInput(nameInput)) isValid = false;
    if (!validateInput(emailInput)) isValid = false;
    if (!validateInput(phoneInput)) isValid = false;
    if (serviceInput && !validateInput(serviceInput)) isValid = false;
    if (!validateInput(messageInput)) isValid = false;
    
    return isValid;
}

// التحقق من صحة حقل واحد
function validateInput(input) {
    let isValid = true;
    let errorMessage = '';
    
    // إزالة رسائل الخطأ السابقة
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // التحقق من الحقل الفارغ
    if (input.value.trim() === '') {
        const currentLang = document.documentElement.lang;
        errorMessage = currentLang === 'ar' ? 'هذا الحقل مطلوب' : 'שדה זה נדרש';
        isValid = false;
    } 
    // التحقق من صحة البريد الإلكتروني
    else if (input.type === 'email' && !validateEmail(input.value)) {
        const currentLang = document.documentElement.lang;
        errorMessage = currentLang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'אנא הזן כתובת אימייל חוקית';
        isValid = false;
    }
    // التحقق من صحة رقم الهاتف
    else if (input.type === 'tel' && !validatePhone(input.value)) {
        const currentLang = document.documentElement.lang;
        errorMessage = currentLang === 'ar' ? 'يرجى إدخال رقم هاتف صحيح' : 'אנא הזן מספר טלפון חוקי';
        isValid = false;
    }
    // التحقق من اختيار الخدمة
    else if (input.tagName === 'SELECT' && input.value === '') {
        const currentLang = document.documentElement.lang;
        errorMessage = currentLang === 'ar' ? 'يرجى اختيار خدمة' : 'אנא בחר שירות';
        isValid = false;
    }
    
    // إظهار رسالة الخطأ إذا كان الإدخال غير صالح
    if (!isValid) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.color = '#ff5252';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        input.parentElement.appendChild(errorElement);
        input.classList.add('invalid');
    } else {
        input.classList.remove('invalid');
    }
    
    return isValid;
}

// التحقق من صحة البريد الإلكتروني
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// التحقق من صحة رقم الهاتف
function validatePhone(phone) {
    // تقبل أرقام الهواتف الإسرائيلية بتنسيقات مختلفة
    const re = /^(\+972|0)([23489]|5[02489]|77)[0-9]{7}$/;
    return re.test(String(phone).replace(/\s/g, ''));
}

// إضافة أنماط CSS للتحقق من صحة النموذج ومؤشر التحميل
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.invalid, .form-group textarea.invalid, .form-group select.invalid {
            border-color: #ff5252;
            box-shadow: 0 0 5px rgba(255, 82, 82, 0.3);
        }
        
        .form-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 15px;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 176, 255, 0.2);
            border-radius: 50%;
            border-top-color: #00b0ff;
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 10px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
});
