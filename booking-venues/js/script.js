document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT REFERENCES ---
    const venueSelectorBtns = document.querySelectorAll('.venue-selector-btn');
    const venueDetailsPanels = document.querySelectorAll('.venue-details-panel');
    const bookingForm = document.getElementById('bookingForm');
    const formVenueName = document.getElementById('formVenueName');
    const formEventDate = document.getElementById('formEventDate');
    const formMessage = document.getElementById('form-message');
    const bookNowBtns = document.querySelectorAll('.book-now-btn');

    // --- VENUE SWITCHING LOGIC ---
    venueSelectorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedVenueId = btn.dataset.venueId;

            // Update active button state
            venueSelectorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show corresponding details panel
            venueDetailsPanels.forEach(panel => {
                if (panel.id === `${selectedVenueId}-details`) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            });

            // Update hidden form field
            formVenueName.value = btn.textContent.trim();
            
            // Re-initialize flatpickr for the newly shown date picker
            initializeDatePicker();
        });
    });

    // --- DATE PICKER INITIALIZATION ---
    function initializeDatePicker() {
        // Destroy any existing instance to avoid duplicates
        if (window.flatpickrInstance) {
            window.flatpickrInstance.destroy();
        }

        // Example: Disable some dates to show it's possible
        const disabledDates = [
            new Date().fp_incr(3), // 3 days from now
            new Date().fp_incr(7), // 7 days from now
            "2024-12-25", // Christmas
            "2025-01-01"  // New Year's Day
        ];

        // Find the visible date picker input
        const visibleDatePicker = document.querySelector('.venue-details-panel:not([style*="display: none"]) #datePicker');

        if (visibleDatePicker) {
            window.flatpickrInstance = flatpickr(visibleDatePicker, {
                minDate: "today",
                disable: disabledDates,
                dateFormat: "Y-m-d",
                onChange: function(selectedDates, dateStr) {
                    formEventDate.value = dateStr;
                }
            });
        }
    }

    // --- FORM SUBMISSION LOGIC ---
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop default form submission

        // Basic validation
        if (!formVenueName.value || !formEventDate.value) {
            showMessage('Please select a venue and a date before submitting.', 'warning');
            return;
        }

        // The form's action attribute handles the submission to Formspree
        // We use the native submit method after our checks
        bookingForm.submit();

        // Show success message and hide form
        showMessage('Thank you! Your booking request has been sent. We will contact you soon.', 'success');
        bookingForm.style.display = 'none';
    });

    // --- BOOK NOW BUTTON LOGIC ---
    bookNowBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('booking-form-section').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- HELPER FUNCTION TO SHOW MESSAGES ---
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `alert alert-${type}`;
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // --- INITIALIZE ON PAGE LOAD ---
    // Set the initial venue name in the form
    const activeBtn = document.querySelector('.venue-selector-btn.active');
    if (activeBtn) {
        formVenueName.value = activeBtn.textContent.trim();
    }
    initializeDatePicker();
});