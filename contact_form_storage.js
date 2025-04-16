// نظام تخزين بيانات نموذج الاتصال وإرسال الإشعارات
document.addEventListener('DOMContentLoaded', function() {
    // إضافة CSS لرسائل التأكيد
    addConfirmationStyles();
    
    // الحصول على نموذج الاتصال
    const contactForm = document.querySelector('.contact-form form');
    
    // إضافة مستمع لحدث الإرسال
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // منع السلوك الافتراضي للنموذج
            event.preventDefault();
            
            // الحصول على قيم الحقول
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // إنشاء كائن بيانات الاتصال
            const contactData = {
                name: name,
                email: email,
                phone: phone,
                message: message,
                date: new Date().toISOString(),
                status: 'new'
            };
            
            // تخزين البيانات في localStorage
            saveContactData(contactData);
            
            // إرسال البيانات بالبريد الإلكتروني
            sendEmailNotification(contactData);
            
            // عرض رسالة نجاح للمستخدم
            showSuccessMessage();
            
            // إعادة تعيين النموذج
            contactForm.reset();
        });
    }
    
    // دالة لإضافة أنماط CSS لرسائل التأكيد
    function addConfirmationStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
            
            .success-message {
                background-color: rgba(0, 150, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
                text-align: center;
                animation: fadeIn 0.5s ease-out;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                font-weight: bold;
                position: relative;
                z-index: 1000;
            }
            
            .success-message.fadeOut {
                animation: fadeOut 0.5s ease-out;
            }
            
            .loading-indicator {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s ease-in-out infinite;
                margin-right: 10px;
                vertical-align: middle;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // دالة لتخزين بيانات الاتصال
    function saveContactData(data) {
        // الحصول على البيانات المخزنة سابقاً
        let contacts = JSON.parse(localStorage.getItem('linkoContacts')) || [];
        
        // إضافة البيانات الجديدة
        contacts.push(data);
        
        // تخزين البيانات المحدثة
        localStorage.setItem('linkoContacts', JSON.stringify(contacts));
    }
    
    // دالة لإرسال إشعار بالبريد الإلكتروني
    function sendEmailNotification(data) {
        // إنشاء نموذج بيانات FormData
        const formData = new FormData();
        formData.append('to_email', 'a.m.shaqra20100@gmail.com');
        formData.append('subject', 'طلب تواصل جديد من موقع Linko');
        
        // إنشاء محتوى البريد الإلكتروني
        const emailContent = `
            <html dir="rtl">
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    h1 { color: #005b9f; border-bottom: 2px solid #005b9f; padding-bottom: 10px; }
                    .info { margin-bottom: 20px; }
                    .label { font-weight: bold; color: #005b9f; }
                    .footer { margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>طلب تواصل جديد من موقع Linko</h1>
                    <div class="info">
                        <p><span class="label">الاسم:</span> ${data.name}</p>
                        <p><span class="label">البريد الإلكتروني:</span> ${data.email}</p>
                        <p><span class="label">رقم الهاتف:</span> ${data.phone}</p>
                        <p><span class="label">الرسالة:</span></p>
                        <p>${data.message}</p>
                        <p><span class="label">التاريخ:</span> ${new Date(data.date).toLocaleString()}</p>
                    </div>
                    <div class="footer">
                        <p>تم إرسال هذا البريد الإلكتروني تلقائياً من موقع Linko.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        formData.append('message_html', emailContent);
        
        // استخدام خدمة Formspree لإرسال البريد الإلكتروني
        fetch('https://formspree.io/f/xbjnkdnv', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('حدث خطأ في إرسال البريد الإلكتروني');
            }
            return response.json();
        })
        .then(data => {
            console.log('تم إرسال البريد الإلكتروني بنجاح:', data);
        })
        .catch(error => {
            console.error('خطأ في إرسال البريد الإلكتروني:', error);
        });
    }
    
    // دالة لعرض رسالة نجاح
    function showSuccessMessage() {
        // إنشاء عنصر رسالة النجاح
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        
        // إضافة مؤشر التحميل
        const loadingIndicator = document.createElement('span');
        loadingIndicator.className = 'loading-indicator';
        successMessage.appendChild(loadingIndicator);
        
        // إضافة محتوى الرسالة حسب اللغة
        const isHebrew = document.documentElement.lang === 'he';
        const messageText = document.createTextNode(isHebrew ? 
            'הטופס נשלח בהצלחה! נחזור אליך בהקדם.' : 
            'تم إرسال النموذج بنجاح! سنعود إليك قريباً.');
        successMessage.appendChild(messageText);
        
        // إضافة الرسالة إلى النموذج
        const formContainer = document.querySelector('.contact-form');
        if (formContainer) {
            // إزالة أي رسائل نجاح سابقة
            const oldMessages = formContainer.querySelectorAll('.success-message');
            oldMessages.forEach(msg => formContainer.removeChild(msg));
            
            // إضافة الرسالة الجديدة
            formContainer.appendChild(successMessage);
            
            // إزالة مؤشر التحميل بعد ثانيتين
            setTimeout(() => {
                if (loadingIndicator.parentNode) {
                    loadingIndicator.parentNode.removeChild(loadingIndicator);
                }
            }, 2000);
            
            // إزالة الرسالة بعد 5 ثوانٍ
            setTimeout(() => {
                successMessage.classList.add('fadeOut');
                setTimeout(() => {
                    if (successMessage.parentNode) {
                        formContainer.removeChild(successMessage);
                    }
                }, 500);
            }, 5000);
        } else {
            console.error('لم يتم العثور على حاوية النموذج');
        }
    }
});

// دالة لعرض البيانات المخزنة (للمسؤولين فقط)
function viewStoredContacts() {
    // الحصول على البيانات المخزنة
    const contacts = JSON.parse(localStorage.getItem('linkoContacts')) || [];
    
    // إنشاء جدول لعرض البيانات
    let tableHTML = '<table style="width:100%; border-collapse: collapse;">';
    tableHTML += '<tr><th style="border: 1px solid #ddd; padding: 8px; text-align: right;">שם</th>';
    tableHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: right;">אימייל</th>';
    tableHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: right;">טלפון</th>';
    tableHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: right;">הודעה</th>';
    tableHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: right;">תאריך</th>';
    tableHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: right;">סטטוס</th></tr>';
    
    // إضافة صفوف البيانات
    contacts.forEach(contact => {
        const date = new Date(contact.date).toLocaleString();
        tableHTML += `<tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${contact.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${contact.email}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${contact.phone}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${contact.message}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${date}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${contact.status}</td>
        </tr>`;
    });
    
    tableHTML += '</table>';
    
    // إنشاء نافذة منبثقة لعرض البيانات
    const popup = window.open('', 'Contacts', 'width=800,height=600');
    popup.document.write(`
        <html dir="rtl">
        <head>
            <title>פניות שהתקבלו - Linko</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 20px; }
                h1 { color: #005b9f; }
                .container { background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background-color: #005b9f; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                button { background-color: #005b9f; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; margin-top: 20px; }
                button:hover { background-color: #0077cc; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>פניות שהתקבלו</h1>
                ${tableHTML}
                <button onclick="window.close()">סגור</button>
                <button onclick="localStorage.removeItem('linkoContacts'); location.reload();">מחק את כל הפניות</button>
            </div>
        </body>
        </html>
    `);
}

// إضافة كلمة مرور بسيطة للوصول إلى البيانات
function adminLogin() {
    const password = prompt("הזן סיסמה למנהל:");
    if (password === "linko2025") {
        viewStoredContacts();
    } else {
        alert("סיסמה שגויה!");
    }
}

// إضافة زر مخفي للوصول إلى لوحة المسؤول
document.addEventListener('DOMContentLoaded', function() {
    const footer = document.querySelector('.footer-bottom');
    if (footer) {
        const adminLink = document.createElement('a');
        adminLink.href = 'javascript:void(0)';
        adminLink.textContent = 'Admin';
        adminLink.style.color = 'rgba(255,255,255,0.1)';
        adminLink.style.fontSize = '10px';
        adminLink.style.marginLeft = '10px';
        adminLink.style.textDecoration = 'none';
        adminLink.onclick = adminLogin;
        
        footer.appendChild(adminLink);
    }
});
