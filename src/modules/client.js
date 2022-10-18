import 'regenerator-runtime'

if (isOld) {
  require('whatwg-fetch')
}

/*
  Documentation => https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper
 */
export default function client(endpoint, {body, ...customConfig} = {}, isForm) {
  // const headers = {'Content-Type': 'application/json'}
  const headers = {}

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body) {
    if (isForm) {
      config.body = getFormData(body)
    } else {
      config.body = getObjectData(body)
    }
  }

  return window
      .fetch(endpoint, config)
      .then(async (response) => {
        const type = response.headers.get('Content-Type')

        const data = type.includes('application/json')
          ? await response.json()
          : await response.text()

        if (response.ok) {
          return data
        } else {
          return Promise.reject(data)
        }
      })
}

function getObjectData(obj) {
  const formdata = new FormData()

  for (const key in obj) {
    formdata.append(key, obj[key])
  }

  return formdata
}

function getFormData(form) {
  const params = {}

  form.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.nodeName === 'SELECT' && el.hasAttribute('multiple')) {
      // Специальный обработчик для множественного селекта, ибо нативно не работает :с
      const checked = Array.from(el.querySelectorAll('option:checked')).map((el) => el.value);
      params[el.name] = checked;
    } else if (el.hasAttribute('type') && el.getAttribute('type') === 'checkbox') {
      // Специальный обработчик чекбоксов
      params[el.name] = el.checked ? '1' : '0';
    } else {
      // И для всех остальных...
      params[el.name] = el.value
    }
  })

  return getObjectData(params)
}