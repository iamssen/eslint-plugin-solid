// @ts-nocheck
import { createStore } from 'solid-js';

function checkValid({ element, validators = [] }, setErrors, errorClass) {
  return async () => {
    element.setCustomValidity('');
    element.checkValidity();
    let message = element.validationMessage;
    if (!message) {
      for (const validator of validators) {
        const text = await validator(element);
        if (text) {
          element.setCustomValidity(text);
          break;
        }
      }
      message = element.validationMessage;
    }
    if (message) {
      errorClass && element.classList.toggle(errorClass, true);
      setErrors((draft) => {
        draft[element.name] = message;
      });
    }
  };
}

export function useForm({ errorClass }) {
  const [errors, setErrors] = createStore({}),
    fields = {};

  const validate =
    (...validators) =>
    (ref) => {
      let config;
      fields[ref.name] = config = { element: ref, validators };
      ref.onblur = checkValid(config, setErrors, errorClass);
      ref.oninput = () => {
        if (!errors[ref.name]) return;
        setErrors((draft) => {
          draft[ref.name] = undefined;
        });
        errorClass && ref.classList.toggle(errorClass, false);
      };
    };

  const formSubmit =
    (callback = () => {}) =>
    (ref) => {
      ref.setAttribute('novalidate', '');
      ref.onsubmit = async (e) => {
        e.preventDefault();
        let errored = false;

        for (const k in fields) {
          const field = fields[k];
          await checkValid(field, setErrors, errorClass)();
          if (!errored && field.element.validationMessage) {
            field.element.focus();
            errored = true;
          }
        }
        !errored && callback(ref);
      };
    };

  return { validate, formSubmit, errors };
}
