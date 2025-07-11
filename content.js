(async function () {
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  console.log('[EXT] Starting...');

  // Step 1: Click the blue CLOSE button
  const closeBtn = document.getElementById('close_btn');
  if (!closeBtn) {
    console.warn('[EXT] CLOSE button with id="close_btn" not found.');
    return;
  }
  closeBtn.click();
  console.log('[EXT] Clicked CLOSE button');

  // Step 2: Wait for the close form popup to appear
  await wait(500);

  // Helper: Select from dropdown (native or custom)
    const selectDropdownOption = async (dropdownSelector, optionText) => {
      const dropdown = document.querySelector(dropdownSelector);
      if (!dropdown) {
        console.warn(`[EXT] Dropdown '${dropdownSelector}' not found`);
        return false;
      }

      try {
        if (dropdown.tagName === "SELECT") {
          // Native <select>
          const option = Array.from(dropdown.options).find(opt =>
            opt.text.trim().toLowerCase() === optionText.toLowerCase()
          );
          if (option) {
            dropdown.value = option.value;
            dropdown.dispatchEvent(new Event('input', { bubbles: true }));
            dropdown.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`[EXT] Selected '${option.text}' in native <select>`);
            return true;
          } else {
            console.warn(`[EXT] Option '${optionText}' not found in <select>`);
          }
        } else {
          // Custom dropdown (simulate click)
          dropdown.click(); // Open dropdown
          console.log(`[EXT] Clicked custom dropdown '${dropdownSelector}'`);
          await wait(300);

          const options = document.querySelectorAll('.select2-results__option, li, div');
          const targetOption = Array.from(options).find(opt =>
            opt.textContent.trim().toLowerCase() === optionText.toLowerCase()
          );
          if (targetOption) {
            targetOption.click();
            console.log(`[EXT] Selected '${optionText}' in custom dropdown`);
            return true;
          } else {
            console.warn(`[EXT] Option '${optionText}' not found in custom dropdown`);
          }
        }
      } catch (err) {
        console.error(`[EXT] Error selecting '${optionText}': ${err.message}`);
      }
      return false;
    };




  
  // Enhanced select value setter with debugging
  const setSelectValue = async (selector, value, maxAttempts = 2) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const el = document.querySelector(selector);
      if (el) {
        // Verify the option exists
        const optionExists = Array.from(el.options).some(opt => opt.value === value);
        if (!optionExists) {
          console.warn(`[EXT] Value ${value} not found in ${selector} options`);
          return false;
        }
        
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`[EXT] Set ${selector} to ${value}`);
        return true;
      }
      console.log(`[EXT] Attempt ${attempt}: ${selector} not found yet`);
      await wait(500 * attempt); // Progressive delay
    }
    console.warn(`[EXT] Failed to set ${selector} after ${maxAttempts} attempts`);
    return false;
  };

  // Step 3: Fill form fields with retry logic
  await setSelectValue('select[name="work_duration_day"]', '0');
  await setSelectValue('select[name="work_duration_hour"]', '1');
  await setSelectValue('select[name="work_duration_minute"]', '0');
  

  // Handle textarea
  const explanation = document.querySelector('textarea[name="solved_description"]');
  if (explanation) {
    explanation.value = 'solved';
    explanation.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    console.warn('[EXT] Textarea not found');
  }

  await wait(500);

  // Step 4: Click the CLOSE TICKET button
  const closeTicketBtn = document.getElementById('close_tt_submit');
  if (closeTicketBtn) {
    closeTicketBtn.click();
    console.log('[EXT] Clicked CLOSE TICKET');
  } else {
    console.warn('[EXT] CLOSE TICKET button not found');
  }
})();
