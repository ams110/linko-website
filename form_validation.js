// تحسين نموذج الاتصال لموقع Linko

document.addEventListener('DOMContentLoaded', function() {
    // الحصول على نموذج الاتصال
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        // إضافة معالج الأحداث لتقديم النموذج
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من صحة البيانات المدخلة
            if (validateForm()) {
                // إظهار رسالة نجاح
                showSuccessMessage();
                
                // إعادة تعيين النموذج
                contactForm.reset();
                
                // يمكن إضافة كود هنا لإرسال البيانات إلى الخادم
                // مثال: sendFormData();
            }
        });
        
        // إضافة مستمعي أحداث للتحقق من الإدخال في الوقت الفعلي
        const formInputs = contactForm.querySelectorAll('input, textarea');
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
    }
});

// التحقق من صحة النموذج بالكامل
function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    
    let isValid = true;
    
    // التحقق من كل حقل
    if (!validateInput(nameInput)) isValid = false;
    if (!validateInput(emailInput)) isValid = false;
    if (!validateInput(phoneInput)) isValid = false;
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

// إظهار رسالة نجاح
function showSuccessMessage() {
    // إنشاء عنصر رسالة النجاح
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    
    // تعيين محتوى الرسالة حسب اللغة الحالية
    const currentLang = document.documentElement.lang;
    if (currentLang === 'ar') {
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.';
    } else {
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> ההודעה שלך נשלחה בהצלחה! ניצור איתך קשר בקרוב.';
    }
    
    // تنسيق الرسالة
    successMessage.style.backgroundColor = 'rgba(0, 176, 255, 0.1)';
    successMessage.style.color = '#00b0ff';
    successMessage.style.padding = '15px';
    successMessage.style.borderRadius = '5px';
    successMessage.style.marginTop = '20px';
    successMessage.style.textAlign = 'center';
    successMessage.style.fontWeight = 'bold';
    successMessage.style.border = '1px solid rgba(0, 176, 255, 0.3)';
    successMessage.style.animation = 'fadeIn 0.5s ease-out';
    
    // إضافة الرسالة إلى النموذج
    const contactForm = document.querySelector('.contact-form form');
    contactForm.parentElement.appendChild(successMessage);
    
    // إزالة الرسالة بعد 5 ثوانٍ
    setTimeout(() => {
        successMessage.style.animation = 'fadeOut 0.5s ease-in';
        setTimeout(() => {
            successMessage.remove();
        }, 500);
    }, 5000);
}

// إضافة أنماط CSS للتحقق من صحة النموذج
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.invalid, .form-group textarea.invalid {
            border-color: #ff5252;
            box-shadow: 0 0 5px rgba(255, 82, 82, 0.3);
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
