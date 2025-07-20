/**
 * 动态执行js代码
 * 
 * @param {string} code js代码字符串
 * @param {string} type 类型
 * @param  {...any} args 参数
 * @returns {void}
 */
function exc(code, type, ...args) {
  switch (type) {
    case 'eval':
      console.log(eval(code))
      break
    case 'function':
      console.log(new Function(...args, code)()) // args 作为参数传递给函数
      break
    case 'setTimeout':
      setTimeout(code, 0)
      break
    case 'setInterval':
      setInterval(code, 0)
      break
    case 'script':
      const script = document.createElement('script')
      // script.innerHTML = code;
      script.textContent = code
      document.body.appendChild(script)
      break
    case 'worker':
      const blob = new Blob([code], { type: 'text/javascript' })
      const url = URL.createObjectURL(blob)
      const worker = new Worker(url)
      console.log(worker)
      break
    case 'with':
      with ({}) {
        eval(code)
      }
      break
    case 'template':
      console.log(Function('return `' + template + '`')(...args))
      break
    case 'proxy':
      const context = new Proxy(
        {},
        {
          get(target, prop) {
            if (prop === 'execute') {
              return () => eval(code)
            }
            return target[prop]
          },
        },
      )
      console.log(context.execute())
      break
    default:
      break
  }
}

// eval 使用示例
exc('console.log("Hello World")', 'proxy');
exc('var x = 5; var y = 10; x + y', 'eval');
exc('Math.max(1, 2, 3, 4, 5)', 'eval');

// Function 使用示例
exc('return "Hello from Function constructor"', 'function', 'arg1', 'arg2');

// setTimeout
function exc2(code, delay = 0) {
  return setTimeout(code, delay);
}

function excInterval(code, interval) {
  return setInterval(code, interval);
}

// 使用示例 测试失败
// exc2('return 1+1', 1000);
// excInterval('console.log("Repeated execution")', 2000);

// script
// exc('console.log("Script tag execution")', 'script');

// worker 测试失败
// const worker = exc('postMessage("Hello from Worker")');
// worker.onmessage = (e) => console.log(e.data);


function exc3(code, context = {}) {
  with (context) {
    return console.log(eval(code));
  }
}

// with使用示例
exc3('x + y', { x: 10, y: 20 });


// exc('Hello ${name}!', 'template');

// template 使用示例 测试失败
// function exc4(template, ...values) {
//   return Function('return `' + template + '`')(...values);
// }

// // 使用示例
// exc4('Hello ${name}!', 'World', 'Alice');


function exc5(jsonString, reviverCode) {
  const reviver = new Function('key', 'value', reviverCode);
  return console.log(JSON.parse(jsonString, reviver));
}

// 使用示例
exc5('{"a": 1, "b": 2}', 'if (typeof value === "number") return value * 2; return value;');


// async function exc6(moduleCode) {
//   const blob = new Blob([moduleCode], { type: 'application/javascript' });
//   const module = await import(URL.createObjectURL(blob));
//   return module;
// }

// // 使用示例
// exc6('export default function() { return "Dynamic module"; }');

