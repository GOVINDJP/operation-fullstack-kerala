// Comprehensive Interview Question & Answer Bank for Operation Full Stack (Kerala Edition)
// 80 High-Yield Questions with Model Answers, Code Snippets, and Interviewer Traps

const INTERVIEW_BANK = [
  // -------------------------------------------------------------
  // CATEGORY 1: JAVASCRIPT CORE & DEEP DIVE (15 Questions)
  // -------------------------------------------------------------
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "What is a closure in JavaScript? Give a real-world production use case.",
    answer: "A closure is the combination of a function bundled together with references to its surrounding lexical environment. In JavaScript, closures allow an inner function to access variables from an outer enclosing function even after the outer function has finished executing.",
    code: `// Real-World Use Case: Function memoization / Private State
function createRateLimiter(limit) {
  let requestCount = 0; // Private state protected from outside modification
  return function() {
    if (requestCount >= limit) {
      throw new Error("Rate limit exceeded. Try again later.");
    }
    requestCount++;
    return \`Request approved (\${requestCount}/\${limit})\`;
  };
}

const limiter = createRateLimiter(3);
limiter(); // "Request approved (1/3)"
limiter(); // "Request approved (2/3)"`,
    trap: "Don't just say 'a function inside a function'. Highlight memory retention: the garbage collector cannot reclaim the outer scope as long as the returned inner function holds a reference to it."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "Explain the difference between var, let, and const, including hoisting and the Temporal Dead Zone (TDZ).",
    answer: "var is function-scoped and hoisted with an initial value of undefined. let and const are block-scoped ({ ... }) and are hoisted to the top of their block, but remain uninitialized in the 'Temporal Dead Zone' (TDZ) until execution reaches their declaration line. Accessing them in the TDZ throws a ReferenceError. Additionally, const cannot be reassigned (though objects declared with const remain mutable).",
    code: `console.log(a); // undefined (hoisted with default value)
var a = 10;

// console.log(b); // ReferenceError: Cannot access 'b' before initialization (TDZ)
let b = 20;

const user = { name: "Govind" };
user.name = "Rahul"; // Allowed: Object mutation
// user = {};        // TypeError: Assignment to constant variable`,
    trap: "Remember that let and const ARE hoisted! Many freshers incorrectly say 'let and const are not hoisted'. They are hoisted, but access before declaration is blocked by the TDZ."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "How does the JavaScript Event Loop work? Explain Microtasks vs Macrotasks with a code example.",
    answer: "JavaScript is single-threaded with a non-blocking concurrency model powered by the Event Loop. When synchronous code runs on the Call Stack, asynchronous tasks are delegated to Web APIs. Upon completion, their callbacks enter queues: 1) Microtask Queue (Promises, queueMicrotask, MutationObserver) and 2) Macrotask/Task Queue (setTimeout, setInterval, I/O, UI events). The Event Loop executes all available Microtasks completely before processing the next single Macrotask.",
    code: `console.log("1: Start");

setTimeout(() => {
  console.log("4: setTimeout (Macrotask)");
}, 0);

Promise.resolve().then(() => {
  console.log("3: Promise (Microtask)");
});

console.log("2: End");

// Output Order:
// 1: Start
// 2: End
// 3: Promise (Microtask)
// 4: setTimeout (Macrotask)`,
    trap: "Interviewers frequently ask what logs first between setTimeout(fn, 0) and Promise.resolve().then(fn). Microtasks ALWAYS drain before the next macrotask runs."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "Implement debounce and throttle from scratch. When would you use each in a real project?",
    answer: "Debounce delays invoking a function until a specified idle time has elapsed since the last time it was called (e.g. search autocomplete or window resize). Throttle guarantees that the function executes at most once per specified time interval (e.g. scroll tracking or game loop physics).",
    code: `// Debounce: Reset timer on every trigger
function debounce(fn, delay) {
  let timerId;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle: Enforce execution interval
function throttle(fn, interval) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}`,
    trap: "Ensure you preserve 'this' and pass '...args' using fn.apply(this, args). If you use a plain arrow function inside without arguments, you lose method context."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "Compare map(), filter(), reduce(), and forEach(). Which ones mutate the original array?",
    answer: "forEach executes a callback for each element and returns undefined; it is used for side effects. map transforms each element and returns a new array of identical length. filter returns a new array containing only elements satisfying a boolean predicate. reduce iterates through the array and accumulates items into a single return value (number, object, array). None of these methods mutate the original array by themselves, though callbacks can inadvertently mutate nested reference types.",
    code: `const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);      // [2, 4, 6, 8, 10]
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]
const sum = numbers.reduce((acc, curr) => acc + curr, 0); // 15`,
    trap: "Do not use map() if you aren't using the returned array — use forEach() or for...of instead to avoid unnecessary memory allocation."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "How does the 'this' keyword behave in arrow functions compared to regular functions?",
    answer: "In regular functions, 'this' is dynamically determined by how the function is invoked (as an object method, standalone function, constructor with 'new', or explicitly bound with call/apply/bind). In arrow functions, 'this' is lexically inherited from the enclosing outer scope at the time the function is defined; arrow functions do not have their own 'this', 'arguments', or 'super'.",
    code: `const profile = {
  name: "Govind",
  greetRegular: function() {
    setTimeout(function() {
      console.log("Regular:", this.name); // undefined (points to window/global)
    }, 100);
  },
  greetArrow: function() {
    setTimeout(() => {
      console.log("Arrow:", this.name);   // "Govind" (lexically inherits from greetArrow)
    }, 100);
  }
};`,
    trap: "Never use an arrow function as an object method if you need 'this' to reference that object (e.g., const obj = { getVal: () => this.x } fails because this references the global scope)."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "What is the difference between a shallow copy and a deep copy? How do you create both in modern JavaScript?",
    answer: "A shallow copy duplicates only top-level primitive values; nested objects or arrays are copied by memory reference, so changing nested data in the clone affects the original. A deep copy recursively copies every nested level, creating a completely independent data structure. Modern browsers support structuredClone() for deep copies.",
    code: `const original = { user: { name: "Dev" }, role: "Admin" };

// Shallow copy (spread operator)
const shallow = { ...original };
shallow.user.name = "Hacked";
console.log(original.user.name); // "Hacked" (shared reference!)

// Deep copy (modern built-in API)
const deep = structuredClone(original);
deep.user.name = "Secure";
console.log(original.user.name); // Still "Hacked" (isolated!)`,
    trap: "Avoid JSON.parse(JSON.stringify(obj)) in interviews as your only answer — explain that it drops Functions, Symbols, undefined, and crashes on circular references."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "Explain Event Bubbling, Event Capturing, and Event Delegation.",
    answer: "When an event occurs in the DOM, it travels through 3 phases: 1) Capturing phase (trickling down from window to the target element), 2) Target phase (the actual element clicked), and 3) Bubbling phase (propagating up from the target back to window). Event Delegation leverages bubbling by attaching a single listener to a common parent element rather than attaching individual listeners to hundreds of child elements, improving memory and handling dynamically created elements.",
    code: `document.getElementById("todo-list").addEventListener("click", function(e) {
  // Check if the clicked element is a delete button
  if (e.target && e.target.matches("button.delete-btn")) {
    const itemId = e.target.closest("li").dataset.id;
    deleteItem(itemId);
  }
});`,
    trap: "Understand the difference between e.target (the exact innermost element clicked) and e.currentTarget (the element that owns the event listener, e.g. the parent container)."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "Explain Promises vs async/await. How do you handle parallel asynchronous requests cleanly?",
    answer: "Promises represent the eventual completion (or failure) of an asynchronous operation and its resulting value, handling results via .then() and .catch(). async/await is syntactic sugar over Promises that allows asynchronous code to be written in a clean, synchronous-looking style with try/catch error handling. For concurrent requests, Promise.all() runs tasks in parallel (rejecting if any fails), while Promise.allSettled() returns the outcome of all promises regardless of rejections.",
    code: `async function fetchDashboardData(userId) {
  try {
    // Run independent network requests concurrently!
    const [userRes, postsRes, statsRes] = await Promise.all([
      fetch(\`/api/users/\${userId}\`),
      fetch(\`/api/users/\${userId}/posts\`),
      fetch(\`/api/users/\${userId}/stats\`)
    ]);
    const user = await userRes.json();
    return { user, posts: await postsRes.json() };
  } catch (err) {
    console.error("Dashboard fetch failed:", err);
    throw err;
  }
}`,
    trap: "Avoid sequential await waterfalls! Don't do: const a = await fetchA(); const b = await fetchB(); if a and b do not depend on each other — use Promise.all()."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "What is Function Currying? Implement a curried function sum(1)(2)(3).",
    answer: "Currying transforms a function that takes multiple arguments into a sequence of nested unary functions that each take a single argument. It facilitates function composition, reuse, and partial application of configuration arguments.",
    code: `// Fixed-arity curry
function sum(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}
console.log(sum(1)(2)(3)); // 6

// Generic infinite curry
const add = a => b => b !== undefined ? add(a + b) : a;
console.log(add(1)(2)(3)(4)()); // 10`,
    trap: "Explain practical use cases: configuring API request headers once and reusing the returned function for specific endpoints."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "How does prototypal inheritance work in JavaScript? What is the prototype chain?",
    answer: "JavaScript does not use classical inheritance; it uses prototypes. Every JavaScript object has an internal [[Prototype]] link (accessible via Object.getPrototypeOf() or __proto__) pointing to another object. When accessing a property on an object, JavaScript searches the object itself; if not found, it traverses up the prototype chain until it finds the property or reaches null (the end of the chain on Object.prototype).",
    code: `function Developer(name, stack) {
  this.name = name;
  this.stack = stack;
}
// Shared method placed on the prototype to save memory
Developer.prototype.code = function() {
  return \`\${this.name} is coding in \${this.stack}\`;
};

const dev = new Developer("Govind", "MERN");
dev.code(); // "Govind is coding in MERN"`,
    trap: "Classes introduced in ES6 are syntactic sugar over prototypal inheritance; they do not introduce a new object-oriented inheritance model."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "What are common causes of memory leaks in JavaScript web applications?",
    answer: "Common causes include: 1) Forgotten timers or intervals (setInterval running indefinitely), 2) Unregistered event listeners on removed DOM nodes, 3) Accidental global variables (assigning without let/const in non-strict mode), 4) Retained closures keeping large outer variables in memory, and 5) Detached DOM references stored in JavaScript arrays or maps.",
    code: `// Memory Leak Example: Forgotten interval & uncleaned listener
function initTracker() {
  const bigData = new Array(1000000).fill("payload");
  const timer = setInterval(() => {
    console.log(bigData.length);
  }, 1000);

  // Fix: Return cleanup function to clearInterval
  return () => clearInterval(timer);
}`,
    trap: "In React, uncleaned useEffect subscriptions or event listeners attached to window/document are the #1 source of memory leak warnings in console."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "Explain strict equality (===) vs loose equality (==) and implicit type coercion.",
    answer: "Loose equality (==) performs implicit type coercion (converting types before comparing according to the Abstract Equality Comparison Algorithm), while strict equality (===) checks both value and type without coercion. For example, '0' == 0 is true because string '0' converts to number 0, but '0' === 0 is false.",
    code: `console.log(0 == false);        // true (coerced)
console.log(0 === false);       // false (number !== boolean)
console.log(null == undefined); // true
console.log(null === undefined);// false
console.log([] == 0);           // true ([] becomes "" then 0)`,
    trap: "Always recommend === in production code to avoid bizarre bugs caused by implicit coercion."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "What are Generator functions and how does the 'yield' keyword work?",
    answer: "A generator function (declared with function*) can pause its execution using the 'yield' keyword and resume later when its .next() method is called. Unlike normal functions which run to completion, generators return an Iterator object, enabling custom iterative algorithms and memory-efficient infinite sequences without allocating huge arrays.",
    code: `function* idGenerator() {
  let id = 1;
  while (true) {
    yield \`USER-\${id++}\`;
  }
}

const gen = idGenerator();
console.log(gen.next().value); // "USER-1"
console.log(gen.next().value); // "USER-2"`,
    trap: "Generators form the underlying foundation for Redux-Saga and async iterators in Node.js streaming."
  },
  {
    category: "javascript",
    categoryLabel: "⚡ JavaScript Core",
    q: "What are JavaScript ES Modules vs CommonJS modules? When is each used?",
    answer: "CommonJS (CJS) uses require() and module.exports, which are synchronous and evaluated at runtime; it has been the historical standard for Node.js. ES Modules (ESM) use import and export, which are asynchronous and statically analyzable at compile time (enabling tree-shaking). Modern Node.js and browsers support ESM natively.",
    code: `// CommonJS (Node traditional)
const fs = require('fs');
module.exports = { myFunction };

// ES Module (Modern Standard)
import fs from 'fs';
export const myFunction = () => {};`,
    trap: "You cannot use import in a CommonJS file without dynamic import() or setting 'type': 'module' in package.json."
  },

  // -------------------------------------------------------------
  // CATEGORY 2: REACT, TYPESCRIPT & FRONTEND (15 Questions)
  // -------------------------------------------------------------
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "How does the Virtual DOM and Reconciliation algorithm work in React?",
    answer: "The Virtual DOM is a lightweight JavaScript object representation of the real DOM. When state changes, React creates a new Virtual DOM tree and runs its Reconciliation algorithm (powered by React Fiber) to compare (diff) the new tree with the previous one. It computes the minimum set of DOM mutations needed and batches them to the real DOM, avoiding expensive layout reflows.",
    code: `// Conceptual representation of a Virtual DOM node
const vdomNode = {
  type: 'button',
  props: {
    className: 'btn-primary',
    onClick: handleClick,
    children: 'Submit Form'
  }
};`,
    trap: "Don't say 'the Virtual DOM is faster than the real DOM in every scenario'. Directly updating a single DOM node is faster, but React's Virtual DOM provides predictable declarative rendering and eliminates unoptimized manual DOM manipulation at scale."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "Why does React require a unique 'key' prop in lists? What breaks if you use array indices?",
    answer: "React uses keys to identify which items in a list have changed, been added, or been removed during reconciliation. If you use array indices as keys and reorder, prepend, or filter the list, the index of each item changes. React matches items by key and mistakenly reuses the existing DOM nodes and component local state (like input values), causing UI bugs and broken animations.",
    code: `// ❌ Dangerous: Index keys cause state mismatch on reorder/delete
{items.map((item, index) => <TodoItem key={index} data={item} />)}

// ✅ Correct: Unique persistent ID
{items.map(item => <TodoItem key={item.id} data={item} />)}`,
    trap: "Explain that using index as key is only safe if: 1) the list is strictly static, 2) items are never reordered or filtered, and 3) items have no local state."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "Explain useEffect: dependency array rules, cleanup functions, and how to avoid infinite loops.",
    answer: "useEffect handles side effects (API calls, subscriptions, DOM mutations). If dependencies are omitted, it runs on every render. If an empty array [] is passed, it runs once on mount. If variables are passed [a, b], it runs when any dependency changes. The returned cleanup function runs before the effect re-runs and on unmount to prevent memory leaks. Infinite loops occur when the effect updates a state variable that is also listed in its own dependency array without a guard.",
    code: `useEffect(() => {
  const controller = new AbortController();
  
  async function loadData() {
    try {
      const res = await fetch(\`/api/profile/\${userId}\`, { signal: controller.signal });
      setData(await res.json());
    } catch (err) {
      if (err.name !== 'AbortError') setError(err);
    }
  }
  loadData();

  // Cleanup: Cancel pending network requests if user changes page/id
  return () => controller.abort();
}, [userId]);`,
    trap: "Mention AbortController for cancelling fetch requests in the cleanup function — interviewers love seeing real production practices."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "Compare Controlled vs Uncontrolled components in React. When would you use useRef?",
    answer: "A controlled component has its form data handled by React state (value={val} and onChange={e => setVal(e.target.value)}), making React the single source of truth. An uncontrolled component keeps form data in the DOM itself, accessed via a useRef() reference. Controlled components are preferred for validation and instant UI updates; uncontrolled components are useful for file inputs or integrating third-party DOM libraries.",
    code: `// Controlled Component
const [email, setEmail] = useState('');
<input value={email} onChange={e => setEmail(e.target.value)} />

// Uncontrolled Component (e.g. File Upload)
const fileInputRef = useRef<HTMLInputElement>(null);
const upload = () => {
  const file = fileInputRef.current?.files?.[0];
};
<input type="file" ref={fileInputRef} />`,
    trap: "File input elements (<input type='file'>) are always uncontrolled in React because their value is read-only by browser security rules."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "When should you use useMemo and useCallback? What is the performance cost of overusing them?",
    answer: "useMemo caches the result of an expensive calculation (e.g. sorting 5,000 items) between renders. useCallback caches a function instance to prevent unnecessary re-renders of memoized child components (React.memo). Overusing them adds memory overhead and dependency array comparison checks that can exceed the cost of simple re-renders. Use them only when profiling demonstrates measurable re-render bottlenecks.",
    code: `// useMemo: caches expensive computed value
const filteredList = useMemo(() => {
  return largeDataset.filter(item => item.score > threshold);
}, [largeDataset, threshold]);

// useCallback: caches stable function reference for child props
const handleSelect = useCallback((id: string) => {
  dispatch({ type: 'SELECT', id });
}, [dispatch]);`,
    trap: "Don't wrap primitive variable assignments or cheap inline calculations in useMemo. It signals cargo-cult optimization to a senior interviewer."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "What is Prop Drilling and what are three architectural solutions to eliminate it?",
    answer: "Prop drilling occurs when data must be passed down through several layers of intermediate components that do not need the data themselves, merely to deliver it to a deeply nested child. Three solutions: 1) Component Composition (passing components as children or slots), 2) React Context API (ideal for global theme, auth, or language), and 3) Global state managers (Zustand or Redux Toolkit).",
    code: `// Solution: Component Composition / Slots avoids Context overhead
<PageLayout 
  header={<UserProfile user={user} />} 
  content={<Feed posts={posts} />} 
/>`,
    trap: "Don't jump straight to Redux for simple prop drilling — mention Component Composition first; it often solves the problem cleanly without extra state."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "In TypeScript, what is the difference between 'interface' and 'type' aliases?",
    answer: "Both can define object structures and be extended. Key differences: 1) Declaration merging: multiple interfaces with the same name merge their properties automatically, while types cannot. 2) Types can define union types (type Role = 'admin' | 'user'), primitives, and tuples, which interfaces cannot. Use interface for public component props and object models; use type for unions, tuples, and utility transformations.",
    code: `// Interface supports declaration merging
interface User { id: string; }
interface User { name: string; } // Merged into { id: string, name: string }

// Type alias supports unions & tuples
type Status = 'idle' | 'loading' | 'success' | 'error';
type Coordinates = [number, number];`,
    trap: "Never say 'interfaces are for OOP and types are for functional'. Both work in functional React; choose based on features like unions vs declaration merging."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "How do you create and type a custom hook in React with TypeScript?",
    answer: "A custom hook is a JavaScript function whose name starts with 'use' and that calls other React hooks. In TypeScript, return types should be explicitly typed, often using 'as const' on tuple returns to ensure correct type inference for destructured consumers.",
    code: `import { useState, useEffect } from 'react';

export function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}`,
    trap: "Ensure custom hooks follow the Rules of Hooks (never call hooks inside loops, conditions, or nested functions)."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "Explain Client-Side Rendering (CSR), Server-Side Rendering (SSR), and Static Site Generation (SSG).",
    answer: "CSR (standard React SPA): Browser downloads a minimal HTML shell and a large JS bundle; rendering occurs in the browser (fast navigation, but slower initial load and weaker SEO). SSR (Next.js): HTML is rendered on the server per request (great SEO, fast First Contentful Paint, higher server load). SSG: Pages are pre-rendered into static HTML at build time (blazing fast via CDN, ideal for blogs/marketing).",
    code: `// CSR: <div id="root"></div> (blank until JS loads)
// SSR: Server sends fully populated HTML on every incoming HTTP request
// SSG: Pre-built HTML generated once during 'npm run build'`,
    trap: "Highlight the modern hybrid model: Next.js or Remix allows mixing SSG for marketing pages, SSR for dynamic dashboards, and CSR for interactive widgets in a single app."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "What are React Error Boundaries? What kinds of errors can they NOT catch?",
    answer: "Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree, log the errors, and display a fallback UI instead of crashing the entire component tree. They MUST be class components using static getDerivedStateFromError() and componentDidCatch(). They cannot catch: 1) Event handler errors, 2) Asynchronous code (setTimeout, fetch), 3) Server-side rendering errors, and 4) Errors thrown inside the boundary component itself.",
    code: `class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    logErrorToService(error, info);
  }
  render() {
    if (this.state.hasError) return <h2>Something went wrong.</h2>;
    return this.props.children;
  }
}`,
    trap: "Explain that for event handler errors, standard try/catch blocks are still required because React does not render during event execution."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "How does React 18 Automatic Batching work?",
    answer: "Prior to React 18, React only batched state updates inside React event handlers (like onClick). State updates inside promises, setTimeout, or native event listeners triggered separate re-renders for each state setter. In React 18, Automatic Batching groups all state updates into a single re-render regardless of where they originate, significantly improving performance.",
    code: `// In React 18: Only 1 single re-render happens here!
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);`,
    trap: "If you ever need to force an immediate re-render without batching, React 18 provides flushSync(() => setVal(x))."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "What is React.lazy and Suspense? How does it improve initial bundle load times?",
    answer: "React.lazy enables dynamic code-splitting by importing components on-demand as separate chunks rather than bundling everything into one monolithic JavaScript file. Suspense wraps the lazy component and displays a fallback spinner while the chunk is downloaded over the network.",
    code: `import React, { Suspense, lazy } from 'react';

// Chunks loaded only when visited
const HeavyAnalyticsChart = lazy(() => import('./HeavyAnalyticsChart'));

function Dashboard() {
  return (
    <Suspense fallback={<div className="skeleton">Loading Chart...</div>}>
      <HeavyAnalyticsChart />
    </Suspense>
  );
}`,
    trap: "Recommend code-splitting at the route level (e.g. React Router routes) as the highest-ROI optimization for initial page load speed."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "How do you optimize rendering performance for large lists of 10,000 items in React?",
    answer: "Rendering 10,000 DOM nodes simultaneously causes severe browser jank and memory bloat. The industry solution is Windowing (or Virtualization), implemented via libraries like react-window or react-virtualized. It renders only the visible subset of items currently inside the viewport (plus a small overscan buffer), recycling DOM nodes as the user scrolls.",
    code: `import { FixedSizeList as List } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style}>Row {index}</div>
);

// Renders only ~15 DOM nodes at any time!
<List height={400} itemCount={10000} itemSize={35} width="100%">
  {Row}
</List>`,
    trap: "Mention pagination and infinite scroll as alternative product solutions before code-level virtualization."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "How do you type React Props with TypeScript, including children and optional callbacks?",
    answer: "Define an interface or type specifying required and optional (?) properties. Use React.ReactNode for components that accept children, and proper function signatures (e.g., (id: string) => void) for event callbacks.",
    code: `interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ label, variant = 'primary', onClick }) => (
  <button className={\`btn-\${variant}\`} onClick={onClick}>{label}</button>
);`,
    trap: "Avoid using React.FC (FunctionComponent) without reason; modern React best practice favors standard function declarations with typed parameter props."
  },
  {
    category: "react",
    categoryLabel: "🔥 React & TypeScript",
    q: "What are React Fragments (<>...</>) and why do we use them instead of extra <div> tags?",
    answer: "React components must return a single root element. Wrapping elements in an extra <div> pollutes the DOM hierarchy, disrupts CSS Flexbox and Grid layouts, and harms accessibility. React Fragments (<React.Fragment> or shorthand <>...</>) group children without adding extra nodes to the DOM.",
    code: `// Shorthand syntax
return (
  <>
    <Header />
    <Main />
  </>
);

// Explicit syntax (required when passing a 'key' prop in loops)
{items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.desc}</dd>
  </React.Fragment>
))}`,
    trap: "Remember that the shorthand <>...</> syntax CANNOT accept a key prop; you must write <React.Fragment key={id}>."
  },

  // -------------------------------------------------------------
  // CATEGORY 3: NODE.JS, EXPRESS & REST APIS (15 Questions)
  // -------------------------------------------------------------
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "What is Express middleware? Write an authentication guard middleware from scratch.",
    answer: "Middleware functions in Express have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle (next). Middleware can execute code, modify req/res objects, end the request cycle, or invoke next() to pass control to the subsequent middleware.",
    code: `const jwt = require('jsonwebtoken');

function authGuard(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    next(); // Pass to next controller
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}`,
    trap: "Always call next() or send a response (res.status().json()). If you do neither, the client request hangs indefinitely until connection timeout."
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "Compare JWT (JSON Web Tokens) vs Session Cookies. What are the security trade-offs?",
    answer: "JWTs are stateless; user identity and claims are cryptographically signed and stored on the client, eliminating database lookups on every request (ideal for microservices and mobile apps). Session cookies are stateful; a session ID is stored in an HTTP-only cookie and verified against a server-side store (Redis/DB). JWT trade-offs: difficult to invalidate before expiry without a blacklist; if stolen via XSS, attacker has full access until expiry. Session cookies are vulnerable to CSRF if SameSite and CSRF tokens are not configured.",
    code: `// JWT Storage Best Practice:
// Store access token in memory or secure HttpOnly, SameSite=Strict cookie
res.cookie('token', jwtToken, {
  httpOnly: true, // Inaccessible to JavaScript (mitigates XSS)
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' // Mitigates CSRF
});`,
    trap: "Don't store sensitive JWTs in localStorage! Any XSS vulnerability in your dependencies allows scripts to steal the token."
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "How does bcrypt hash passwords and why are salt rounds critical?",
    answer: "bcrypt is an adaptive cryptographic hash function designed specifically for passwords. It incorporates a salt (random string concatenated with the password before hashing) to protect against Rainbow Table attacks. Crucially, bcrypt is deliberately computationally slow: salt rounds (cost factor) define the number of hashing iterations (2^rounds). As hardware becomes faster, increasing rounds keeps brute-force cracking mathematically infeasible.",
    code: `const bcrypt = require('bcrypt');

async function hashPassword(plainPassword) {
  const saltRounds = 12; // 2^12 iterations (~250ms per hash)
  return await bcrypt.hash(plainPassword, saltRounds);
}

async function verifyPassword(plainInput, storedHash) {
  return await bcrypt.compare(plainInput, storedHash);
}`,
    trap: "Never use fast hashing algorithms like MD5, SHA-1, or plain SHA-256 for passwords — specialized GPUs can calculate billions of SHA-256 hashes per second."
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "How do you architect centralized error handling in an Express production application?",
    answer: "Create an operational AppError class to distinguish operational errors (e.g. invalid inputs, 404s) from programmer bugs. Wrap asynchronous route handlers in an async wrapper (or express-async-errors) to catch rejected promises without repetitive try/catch blocks. Finally, define a 4-parameter error middleware (err, req, res, next) at the end of the app to format error responses consistently and log critical crashes.",
    code: `// Custom Operational Error Class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Global Error Handler Middleware (Must have 4 arguments!)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";
  
  if (statusCode === 500) console.error("CRITICAL ERROR:", err);
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
});`,
    trap: "Express identifies error-handling middleware ONLY if the function signature has exactly 4 arguments: (err, req, res, next). If you omit 'next', it behaves as standard middleware!"
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "Explain RESTful HTTP status codes: 200, 201, 204, 400, 401, 403, 404, 500.",
    answer: "200 OK: Standard successful GET/PUT/PATCH. 201 Created: Resource successfully created (POST). 204 No Content: Successful request with no body returned (DELETE). 400 Bad Request: Invalid client payload or schema validation failure. 401 Unauthorized: Authentication missing or invalid (unauthenticated). 403 Forbidden: Authenticated user lacks authorization/permission. 404 Not Found: Resource does not exist. 500 Internal Server Error: Unhandled server crash.",
    code: `res.status(201).json({ id: "job_123", title: "Frontend Developer" });
res.status(204).send(); // DELETE complete
res.status(401).json({ error: "Please log in first" });
res.status(403).json({ error: "Admin role required" });`,
    trap: "The difference between 401 and 403 is one of the most common fresher interview traps: 401 = 'Who are you?' (authentication); 403 = 'I know who you are, but you cannot enter here' (authorization)."
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "Explain the Node.js Event Loop phases in detail.",
    answer: "The Node.js event loop coordinates non-blocking I/O through distinct phases: 1) Timers: executes callbacks scheduled by setTimeout and setInterval. 2) Pending Callbacks: executes I/O callbacks deferred from the previous iteration. 3) Idle, Prepare: internal node usage. 4) Poll: retrieves new I/O events and executes I/O callbacks; blocks if queue empty. 5) Check: executes setImmediate callbacks. 6) Close Callbacks: executes close handlers (e.g. socket.on('close')). Between every phase, process.nextTick() and Microtask queues drain immediately.",
    code: `setImmediate(() => console.log("check phase: setImmediate"));
setTimeout(() => console.log("timers phase: setTimeout"), 0);
process.nextTick(() => console.log("microtask: nextTick")); // Runs first!`,
    trap: "process.nextTick() is not technically part of the Event Loop; it executes immediately after the current operation completes, before the event loop continues."
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "What are Streams and Buffers in Node.js? Why are they vital for file processing?",
    answer: "A Buffer is a raw chunk of allocated memory outside the V8 heap used to handle binary data. A Stream is an interface for reading or writing continuous data piece-by-piece rather than loading the entire file into memory at once. For instance, reading a 2GB file with fs.readFile() crashes with a memory overflow error, whereas fs.createReadStream() pipes data chunk-by-chunk in 64KB increments with minimal RAM usage.",
    code: `const fs = require('fs');

// Efficient file streaming
const readStream = fs.createReadStream('large-video.mp4');
const writeStream = fs.createWriteStream('copy.mp4');

readStream.pipe(writeStream); // Streams chunk by chunk`,
    trap: "Always pipe streams with error handling: readStream.on('error', handler) or use pipeline() from stream/promises to avoid memory leaks on network drops."
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "How do you protect an Express REST API against common web vulnerabilities?",
    answer: "1) CORS: Configure explicit origin allow-lists. 2) Helmet: Automatically sets secure HTTP headers (HSTS, Content-Security-Policy). 3) Rate Limiting: Use express-rate-limit to mitigate brute-force and DDoS attacks. 4) Input Sanitization & Validation: Use Zod or express-validator to reject malicious payloads and prevent NoSQL/SQL injections. 5) Data Protection: Avoid exposing stack traces in production (NODE_ENV === 'production').",
    code: `const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per IP per window
}));`,
    trap: "Never do app.use(cors({ origin: '*' })) in production APIs that handle authenticated cookies or user data."
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "Compare Offset-based vs Cursor-based pagination for large datasets.",
    answer: "Offset pagination uses LIMIT x OFFSET y. It is simple to implement but has two major flaws at scale: 1) Performance degradation: The database must scan through all offset rows before discarding them (e.g. OFFSET 1,000,000 reads 1M rows). 2) Data drift: If records are inserted/deleted while the user paginates, items duplicate or are skipped. Cursor pagination uses a unique indexed pointer (e.g. WHERE id > last_seen_id LIMIT 20); it is constant O(1) speed and eliminates data drift.",
    code: `// Offset Pagination: Degrades at large offsets
SELECT * FROM jobs ORDER BY created_at DESC LIMIT 20 OFFSET 50000;

// Cursor Pagination: Fast indexed seek
SELECT * FROM jobs WHERE id < 'job_cursor_xyz' ORDER BY id DESC LIMIT 20;`,
    trap: "Cursor pagination is ideal for infinite scroll feeds (Twitter, Instagram). Offset pagination is suitable only when users need to jump to a specific page number (Page 15)."
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "What is Clustering in Node.js and why do production apps use PM2?",
    answer: "Because Node.js runs on a single thread by default, a server with 8 CPU cores utilizes only 1 core. The Node.js cluster module allows spawning multiple child worker processes that share the same server port. PM2 is a production process manager that handles clustering automatically, balances loads across CPU cores, and restarts crashed processes with zero downtime.",
    code: `# Launch app in PM2 cluster mode matching available CPU cores
pm2 start server.js -i max --name "fullstack-api"`,
    trap: "When using clustering, your application state must be stateless. You cannot store user sessions in local process memory — you must use an external store like Redis."
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "How do WebSockets differ from standard HTTP polling and Server-Sent Events (SSE)?",
    answer: "HTTP Polling involves the client repeatedly sending requests at intervals (high bandwidth waste). Server-Sent Events (SSE) provide a one-way persistent HTTP connection where the server pushes updates to the client (ideal for stock tickers, live notifications). WebSockets provide a full-duplex, bidirectional persistent TCP connection over a single socket, ideal for real-time chat apps and multiplayer games.",
    code: `// WebSocket: Client & Server can send data anytime in real-time
const ws = new WebSocket("wss://api.example.com/chat");
ws.onmessage = (event) => console.log("New message:", event.data);
ws.send("Hello server!");`,
    trap: "Don't use WebSockets for simple notification feeds when SSE is simpler, natively reconnects, and works over standard HTTP/2."
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "What is Idempotency in HTTP methods? Which methods are idempotent?",
    answer: "An HTTP method is idempotent if making multiple identical requests has the same effect on the server state as making a single request. GET, HEAD, OPTIONS, PUT, and DELETE are idempotent. POST is NOT idempotent (submitting 3 identical POST requests creates 3 separate database records).",
    code: `// DELETE is idempotent: deleting resource #4 twice leaves it deleted
DELETE /api/jobs/4 -> 204 No Content
DELETE /api/jobs/4 -> 404 (Resource already gone, server state unchanged)

// POST is NOT idempotent: creates multiple records
POST /api/jobs -> Creates record #1
POST /api/jobs -> Creates record #2`,
    trap: "Many freshers think DELETE is not idempotent because the second call returns 404. Idempotency refers to server state change, not the status code returned!"
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "How do you handle file uploads safely in Node.js with Multer?",
    answer: "Use the Multer middleware to process multipart/form-data. Safety measures include: 1) File type validation (checking MIME types and file extensions), 2) File size limits (e.g. max 5MB to prevent disk exhaustion), and 3) Storing files in cloud object storage (AWS S3, Cloudinary) rather than on the local application server filesystem.",
    code: `const multer = require('multer');

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed!'), false);
    }
  }
});

app.post('/api/profile/avatar', upload.single('avatar'), controller);`,
    trap: "Never trust file.originalname alone for security; rename uploaded files with random UUIDs to prevent directory traversal and file overwrite attacks."
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "Walk me through your production deployment pipeline for a MERN stack application.",
    answer: "1) Code is pushed to GitHub feature branch. 2) GitHub Actions runs automated linting and unit tests. 3) Frontend is built and deployed as static assets to Vercel/Netlify with CDN caching. 4) Backend is containerized via Dockerfile and deployed to Render/Railway/AWS. 5) MongoDB Atlas cluster is secured via IP allowlisting. 6) Secrets and API keys are injected via environment variables (never committed to git). 7) Health check endpoints monitor uptime.",
    code: `// Health check endpoint in server.js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime(), timestamp: Date.now() });
});`,
    trap: "Mention health check endpoints (/health) — recruiters love knowing you think about monitoring and uptime."
  },
  {
    category: "node",
    categoryLabel: "🏰 Node.js & REST APIs",
    q: "What is the purpose of package-lock.json and why must it be committed to version control?",
    answer: "package.json specifies version ranges using semver (e.g. ^18.2.0, allowing non-breaking minor updates). package-lock.json records the exact, deterministic version of every installed package and all transitive sub-dependencies, along with integrity hashes. Committing package-lock.json guarantees that every developer and production build server installs the identical dependency tree ('works on my machine' prevention).",
    code: `# Use npm ci in production/CI builds instead of npm install
npm ci`,
    trap: "npm ci (Clean Install) installs directly from package-lock.json and fails if package.json and lockfile are out of sync."
  },

  // -------------------------------------------------------------
  // CATEGORY 4: DATABASES — SQL & MONGODB (12 Questions)
  // -------------------------------------------------------------
  {
    category: "database",
    categoryLabel: "🗄️ SQL & MongoDB",
    q: "When should you choose a Relational (SQL) database vs a Document (MongoDB) database?",
    answer: "Choose SQL (PostgreSQL/MySQL) when your data has strict relational structures, requires ACID transactions (e.g. banking, payment processing, inventory), and complex multi-table JOINs are frequent. Choose MongoDB when data structures are hierarchical, unstructured, or rapidly changing, and when high write throughput and horizontal scaling (sharding) are prioritized.",
    code: `// SQL: Rigid tables, foreign keys, ACID compliance
CREATE TABLE orders (id INT PRIMARY KEY, user_id INT REFERENCES users(id));

// MongoDB: Rich embedded documents, schema flexibility
const orderSchema = { orderId: 101, items: [{ title: 'Book', qty: 2 }] };`,
    trap: "Don't say 'MongoDB has no schema'. In production, MongoDB schemas are enforced via Mongoose or JSON Schema validation."
  },
  {
    category: "database",
    categoryLabel: "🗄️ SQL & MongoDB",
    q: "Explain INNER JOIN, LEFT JOIN, and self joins with a clear SQL example.",
    answer: "INNER JOIN returns only rows that have matching values in both tables. LEFT JOIN returns all rows from the left table, plus matched rows from the right table (unmatched right rows become NULL). A Self Join joins a table to itself, useful for hierarchical structures like employee-manager relationships.",
    code: `// INNER JOIN: Only users who have created job applications
SELECT u.name, a.job_title 
FROM users u 
INNER JOIN applications a ON u.id = a.user_id;

// LEFT JOIN: All users, including those with zero applications
SELECT u.name, COALESCE(a.job_title, 'No Applications') 
FROM users u 
LEFT JOIN applications a ON u.id = a.user_id;`,
    trap: "Always specify table aliases (u, a) to prevent ambiguous column errors on shared column names like 'id' or 'created_at'."
  },
  {
    category: "database",
    categoryLabel: "🗄️ SQL & MongoDB",
    q: "What is a Database Index? How does it speed up queries and why does it slow down writes?",
    answer: "An index is a specialized data structure (typically a B-Tree) that holds sorted values of specific columns along with pointers to the corresponding full row in storage. It allows the database engine to find matching records in O(log N) time rather than executing an expensive full table scan O(N). However, every INSERT, UPDATE, or DELETE requires the database to update the index tree, adding overhead to write operations.",
    code: `// SQL: Create index on frequently queried column
CREATE INDEX idx_jobs_city ON jobs(city);

// MongoDB: Mongoose index
jobSchema.index({ city: 1, salary: -1 });`,
    trap: "Don't index every column! Index only columns used in WHERE clauses, JOIN conditions, and ORDER BY sorting."
  },
  {
    category: "database",
    categoryLabel: "🗄️ SQL & MongoDB",
    q: "What is Database Normalization (1NF, 2NF, 3NF)? Why do we normalize?",
    answer: "Normalization organizes database tables to reduce data redundancy and eliminate insert, update, and deletion anomalies. 1NF: Atomic values (no repeating groups/arrays in a single column). 2NF: In 1NF and all non-key attributes are fully dependent on the primary key (no partial dependencies on composite keys). 3NF: In 2NF and no transitive dependencies (non-key columns do not depend on other non-key columns).",
    code: `// Unnormalized: user_address column contains "Kochi, Kerala, 682001"
// 3NF: Split into separate tables: Users -> Addresses (or city_id foreign key)`,
    trap: "Explain that in high-read systems, deliberate denormalization is often applied to avoid expensive multi-table JOINs."
  },
  {
    category: "database",
    categoryLabel: "🗄️ SQL & MongoDB",
    q: "Explain ACID properties in database transactions with a bank transfer example.",
    answer: "Atomicity: All operations in the transaction succeed, or the entire transaction rolls back ('all or nothing'). Consistency: Database transitions from one valid state to another, satisfying all constraints. Isolation: Concurrent transactions execute independently without interference. Durability: Once committed, data changes survive system crashes or power failures.",
    code: `START TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT; -- If either update fails, ROLLBACK occurs automatically`,
    trap: "MongoDB also supports multi-document ACID transactions since version 4.0, though they are primarily used in replica sets."
  },
  {
    category: "database",
    categoryLabel: "🗄️ SQL & MongoDB",
    q: "How does the MongoDB Aggregation Pipeline work? Explain $match and $group.",
    answer: "The aggregation pipeline is a framework for data processing where documents pass through a multi-stage pipeline. Each stage transforms the documents as they pass through. $match filters documents (analogous to SQL WHERE), and $group groups documents by a specified key to calculate aggregated values like sums or averages (analogous to SQL GROUP BY).",
    code: `// Calculate average salary per tech stack
db.jobs.aggregate([
  { $match: { status: "ACTIVE" } },
  { $group: {
      _id: "$stack",
      avgSalary: { $avg: "$salary" },
      totalJobs: { $sum: 1 }
    }
  },
  { $sort: { avgSalary: -1 } }
]);`,
    trap: "Always place $match and $sort stages as early in the pipeline as possible so MongoDB can leverage database indexes."
  },
  {
    category: "database",
    categoryLabel: "🗄️ SQL & MongoDB",
    q: "What is the difference between WHERE and HAVING in SQL?",
    answer: "WHERE filters individual rows BEFORE any groupings or aggregate functions (SUM, AVG, COUNT) are calculated. HAVING filters aggregated groups AFTER the GROUP BY clause has executed.",
    code: `SELECT city, COUNT(*) as dev_count
FROM developers
WHERE experience_years >= 2  -- Filters individual rows
GROUP BY city
HAVING COUNT(*) > 10;        -- Filters aggregated groups`,
    trap: "You cannot use aggregate functions inside a WHERE clause (e.g., WHERE COUNT(*) > 10 throws a syntax error)."
  },
  {
    category: "database",
    categoryLabel: "🗄️ SQL & MongoDB",
    q: "What are SQL Common Table Expressions (CTEs) and why are they cleaner than subqueries?",
    answer: "A CTE is a temporary named result set defined using the WITH keyword that exists only for the duration of a single execution query. Unlike nested subqueries, CTEs improve readability, can be referenced multiple times within the same query, and support recursive querying (e.g. organizational hierarchies).",
    code: `WITH HighPayingJobs AS (
  SELECT id, title, salary FROM jobs WHERE salary > 800000
)
SELECT title, salary FROM HighPayingJobs WHERE title LIKE '%React%';`,
    trap: "Recursive CTEs are the standard solution in SQL for querying tree data like comments/replies or category hierarchies."
  },
  {
    category: "database",
    categoryLabel: "🗄️ SQL & MongoDB",
    q: "What is Connection Pooling and why is opening a new database connection on every HTTP request dangerous?",
    answer: "Establishing a database connection requires expensive TCP handshakes, TLS negotiation, and authentication overhead. If an API opens a new connection per incoming request, traffic spikes quickly exhaust database connection limits, crashing the server. A Connection Pool maintains a warm cache of reusable open connections; incoming queries borrow an available connection from the pool and return it upon completion.",
    code: `// Pool configuration in mysql2 or pg
const pool = mysql.createPool({
  connectionLimit: 10, // Max 10 active connections
  host: 'localhost',
  user: 'root',
  database: 'fullstack'
});`,
    trap: "In serverless environments (AWS Lambda), connection pooling requires special proxies (AWS RDS Proxy) because stateless lambda functions instantiate separate pools."
  },
  {
    category: "database",
    categoryLabel: "🗄️ SQL & MongoDB",
    q: "Compare Primary Keys, Foreign Keys, and UUIDs. When should you use UUID over auto-increment ID?",
    answer: "A Primary Key uniquely identifies each record in a table. A Foreign Key references a Primary Key in another table, enforcing referential integrity. Auto-increment IDs are compact (4-8 bytes integers) and fast for sorting, but expose database size and record counts in URLs (e.g. /users/42). UUIDs (Universally Unique Identifiers) are 128-bit identifiers generated on client/server without collisions, making them safe for distributed systems and public API URLs.",
    code: `// PostgreSQL with UUID
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL
);`,
    trap: "Traditional random UUID v4 can fragment B-Tree indexes; modern databases use UUID v7, which is time-ordered and index-friendly."
  },
  {
    category: "database",
    categoryLabel: "🗄️ SQL & MongoDB",
    q: "How do you prevent SQL Injection and NoSQL Injection attacks?",
    answer: "For SQL: ALWAYS use Parameterized Queries (Prepared Statements) or an ORM/query builder (Prisma, Knex); never concatenate raw user strings into SQL queries. For MongoDB: Validate inputs using a schema validator (Zod) and avoid passing raw req.body into queries (which allows attackers to pass query operators like { '$gt': '' } to bypass authentication).",
    code: `// ❌ Vulnerable to SQL Injection:
db.query(\`SELECT * FROM users WHERE email = '\${req.body.email}'\`);

// ✅ Protected Parameterized Query:
db.query('SELECT * FROM users WHERE email = ?', [req.body.email]);

// MongoDB: Clean string validation
const email = String(req.body.email); // Prevents object injection`,
    trap: "Demonstrate knowledge of NoSQL operator injection: passing { 'password': { '$gt': '' } } can log in as admin if input is unvalidated!"
  },
  {
    category: "database",
    categoryLabel: "🗄️ SQL & MongoDB",
    q: "What is Optimistic Locking vs Pessimistic Locking?",
    answer: "Pessimistic Locking locks a database record immediately upon reading it, preventing all other transactions from modifying it until the current transaction completes (used in high-conflict banking). Optimistic Locking assumes conflicts are rare; records contain a version number (__v). When writing, it checks if the version has changed; if another transaction modified the record in the meantime, the update is rejected and retried.",
    code: `// Optimistic Locking in Mongoose:
// Mongoose uses the __v field automatically to reject stale concurrent writes
jobSchema.set('optimisticConcurrency', true);`,
    trap: "Optimistic locking is vastly preferred in web applications because holding locks across long web requests causes database bottlenecks."
  },

  // -------------------------------------------------------------
  // CATEGORY 5: SYSTEM DESIGN & ARCHITECTURE (8 Questions)
  // -------------------------------------------------------------
  {
    category: "architecture",
    categoryLabel: "🏗️ System Design & Web Architecture",
    q: "What happens from the moment you type 'google.com' into the browser and press Enter?",
    answer: "1) URL Parsing: Browser identifies protocol, host, and port. 2) DNS Lookup: Browser checks cache (browser -> OS -> router -> ISP DNS), then resolves domain to an IP address. 3) TCP Handshake: 3-way handshake (SYN, SYN-ACK, ACK) establishes a TCP connection. 4) TLS Handshake: Negotiates cryptographic keys for HTTPS. 5) HTTP Request: Browser sends GET request with headers. 6) Server Processing: Server/reverse proxy routes request and returns HTTP response. 7) DOM & CSSOM Parsing: Browser constructs render tree, computes layout, paints pixels, and executes JavaScript.",
    code: `// Core Flow:
// User Input -> DNS -> TCP/TLS -> HTTP Request -> Server/DB -> HTML/CSS/JS -> Critical Rendering Path -> Painted Screen`,
    trap: "Mentioning the Critical Rendering Path (DOM -> CSSOM -> Render Tree -> Layout -> Paint) demonstrates deep frontend maturity."
  },
  {
    category: "architecture",
    categoryLabel: "🏗️ System Design & Web Architecture",
    q: "What is a CDN (Content Delivery Network) and how does Edge Caching work?",
    answer: "A CDN is a geographically distributed network of proxy edge servers located close to users. When a user requests static assets (JS, CSS, images, video), the request is routed to the nearest edge server (Point of Presence). If cached, the asset is served with low latency, reducing load on the origin server and drastically improving load times globally.",
    code: `// HTTP Cache Header for CDN
Cache-Control: public, max-age=31536000, immutable`,
    trap: "Explain cache invalidation: when shipping updates, build tools append content hashes (main.a7f8b9.js) so edge caches immediately recognize updated files."
  },
  {
    category: "architecture",
    categoryLabel: "🏗️ System Design & Web Architecture",
    q: "Explain Horizontal vs Vertical Scaling. What are the trade-offs?",
    answer: "Vertical Scaling ('scaling up') means upgrading the CPU, RAM, or SSD of an existing server. Trade-off: simple with zero architectural changes, but has a hard physical ceiling and single point of failure. Horizontal Scaling ('scaling out') means adding more machine instances behind a Load Balancer (Nginx/AWS ALB). Trade-off: infinite theoretical capacity and high availability, but requires a stateless application architecture and external cache/database stores.",
    code: `// Horizontal Scaling Setup:
// Client -> Load Balancer (Round Robin) -> [Server 1, Server 2, Server 3] -> Shared Redis + DB`,
    trap: "Always emphasize that web servers must be stateless to support horizontal scaling; user sessions cannot reside in local memory."
  },
  {
    category: "architecture",
    categoryLabel: "🏗️ System Design & Web Architecture",
    q: "What are In-Memory Caching systems like Redis, and when should you implement caching?",
    answer: "Redis is an in-memory key-value data store that delivers sub-millisecond read/write speeds. Implement caching when: 1) Expensive database queries run frequently with identical results (e.g. popular job listings, user profiles), 2) Session storage is needed across clustered nodes, or 3) Rate-limiting counters require high-speed atomic increments.",
    code: `async function getJobDetails(jobId) {
  // Check Redis cache first
  const cached = await redis.get(\`job:\${jobId}\`);
  if (cached) return JSON.parse(cached);

  // Cache miss: Query DB & store in Redis with 1-hour expiration (TTL)
  const job = await db.jobs.findById(jobId);
  await redis.setex(\`job:\${jobId}\`, 3600, JSON.stringify(job));
  return job;
}`,
    trap: "Always specify a Time-To-Live (TTL) on cached keys; otherwise, stale data persists indefinitely and causes cache bloat."
  },
  {
    category: "architecture",
    categoryLabel: "🏗️ System Design & Web Architecture",
    q: "Compare Monolithic Architecture vs Microservices Architecture for a startup.",
    answer: "A Monolith bundles UI, business logic, and database access into a single unified codebase and deployment artifact. Pros: simple to build, test, debug, and deploy; low initial operational overhead. Cons: scaling bottlenecks, large blast radius for bugs. Microservices split functionality into independently deployed domain services communicating via HTTP/gRPC. Pros: independent team scaling, fault isolation. Cons: massive DevOps complexity, distributed transaction difficulties, network latency. Freshers and startups should almost always start with a clean modular monolith.",
    code: `// Rule of Thumb: Start with a modular Monolith; extract services only when team boundaries or specific scaling requirements demand it.`,
    trap: "Don't claim microservices are always better. Acknowledging operational complexity and network overhead shows senior-level architectural maturity."
  },
  {
    category: "architecture",
    categoryLabel: "🏗️ System Design & Web Architecture",
    q: "What are Message Queues (e.g. BullMQ, RabbitMQ) and why are background jobs necessary?",
    answer: "A message queue enables asynchronous processing by decoupling time-consuming tasks from the client request-response lifecycle. Operations like sending welcome emails, resizing video uploads, or generating PDF invoices shouldn't block the HTTP response. The web server pushes a job payload to the queue and returns an immediate 202 Accepted response; background worker processes process jobs from the queue asynchronously.",
    code: `// Express Route Handler: Immediate response
app.post('/api/export-pdf', async (req, res) => {
  await pdfQueue.add('generate', { userId: req.user.id });
  res.status(202).json({ message: "PDF generation started. You will be notified." });
});`,
    trap: "Message queues provide resilience: if a worker crashes during processing, the job is retried automatically rather than lost."
  },
  {
    category: "architecture",
    categoryLabel: "🏗️ System Design & Web Architecture",
    q: "What is Docker and containerization? How does a container differ from a Virtual Machine?",
    answer: "A container packages an application and all its system dependencies into an isolated runtime unit that runs identically on any machine. A Virtual Machine (VM) virtualizes the underlying hardware and runs an entire Guest Operating System (hundreds of MBs/GBs with slow boot times). A Docker container shares the host machine’s OS kernel, isolating processes at the user space level (lightweight, megabytes in size, and starts in milliseconds).",
    code: `# Standard Production Node.js Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]`,
    trap: "Always mention using Alpine Linux images (node:alpine) to keep Docker image sizes small and secure."
  },
  {
    category: "architecture",
    categoryLabel: "🏗️ System Design & Web Architecture",
    q: "What is CORS (Cross-Origin Resource Sharing) and what is an HTTP Preflight (OPTIONS) request?",
    answer: "CORS is a browser security mechanism that restricts web pages from making HTTP requests to a domain different from the domain that served the web page. For 'non-simple' requests (e.g. requests with Content-Type: application/json or Authorization headers, or methods like PUT/DELETE), the browser automatically sends an HTTP OPTIONS preflight request before the actual request. The server must respond with appropriate Access-Control-Allow-Origin, Methods, and Headers before the browser allows the actual request.",
    code: `// Preflight Request:
OPTIONS /api/users
Origin: https://myfrontend.com
Access-Control-Request-Method: POST

// Server Response:
Access-Control-Allow-Origin: https://myfrontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization`,
    trap: "CORS is strictly a BROWSER security feature! Postman, curl, and server-to-server calls do NOT enforce CORS."
  },

  // -------------------------------------------------------------
  // CATEGORY 6: HR, BEHAVIOURAL & STAR METHOD (15 Questions)
  // -------------------------------------------------------------
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "Tell me about yourself (The 30-Second Formula).",
    answer: "Use the Present -> Past -> Future formula. Keep it strictly focused on your professional identity, relevant technical skills, shipped deliverables, and what you are excited to build.",
    code: `// Model Script (Practice Out Loud):
"I am a full-stack developer with a strong focus on the MERN stack and TypeScript. Over the past several months, I've built and deployed production-style applications, including a full-stack Job Board with JWT auth and REST endpoints, as well as an interactive analytics tool using Python and Power BI. 

Previously, during my frontend internship, I developed responsive interfaces using HTML/CSS and JavaScript. I'm now looking to bring my full-stack skillset, rapid learning capability, and daily shipping discipline to an engineering team where I can contribute to real customer-facing products."`,
    trap: "Do not recite your school marks, family background, or high school hobbies. Start directly with your engineering stack and recent shipped projects."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "Why should we hire you as a fresher over someone with more years of experience?",
    answer: "Anchor on your proof-of-work, recent full-stack hands-on muscle memory, clean coding practices, and high learning velocity without legacy habits.",
    code: `// Model Script:
"While I am an entry-level developer, what sets me apart is that my knowledge isn't theoretical tutorial-watching. I have built and deployed 4 full-stack projects with live URLs, CI/CD pipelines, and automated tests. 

Because I have spent the last 32 weeks dedicating 30 hours weekly to building from scratch, my muscle memory in React, Node, SQL, and Git is sharp. I have no bad legacy habits to unlearn, and I am eager to ramp up quickly on your codebase and deliver measurable tickets from week two."`,
    trap: "Never sound defensive about being a fresher. Frame freshness as high energy, fast ramp-up speed, and current modern stack knowledge."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "Tell me about a challenging bug that took you days to solve. How did you identify and fix it? (STAR Method)",
    answer: "Use the STAR method: Situation (Context), Task (Goal), Action (Debugging methodology), and Result (Resolution & preventive measure).",
    code: `// Model Script:
• Situation: "In my Job Board capstone project, users reported intermittent session timeouts and 401 Unauthorized errors during pagination."
• Task: "I needed to identify whether the issue stemmed from client-side token expiration or server-side CORS preflight headers."
• Action: "I reproduced the bug locally with Chrome DevTools Network tab and noticed the authorization header was missing on automated CORS preflight OPTIONS requests. Inspecting my Express middleware, I realized my authGuard was executing before the CORS middleware was handling OPTIONS checks."
• Result: "I reordered the middleware pipeline to ensure CORS preflight passed before authentication. I added an automated Postman test suite to catch regression, and 401 errors dropped to zero."`,
    trap: "Focus on the systematic debugging process (DevTools, logging, reproducing), not luck or 'I stumbled onto the answer on StackOverflow'."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "What did you do during your frontend internship? Quantify your impact.",
    answer: "Avoid passive descriptions like 'I did tickets'. Use action verbs and quantifiable metrics (number of screens, load time improvements, bug reductions).",
    code: `// Model Script:
"During my internship, I worked on the core customer portal. Rather than just styling templates, I refactored 12 legacy UI pages into modular, responsive components using semantic HTML5 and CSS Grid, which reduced mobile layout bug tickets by 30%. 

I also collaborated with senior backend engineers to consume REST endpoints, implemented client-side form validation, and actively participated in daily standups and pull request code reviews."`,
    trap: "If you don't know the exact percentage, estimate conservatively: 'reduced tickets by roughly 25-30%' or 'delivered 12 responsive pages'."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "Tell me about a time you had to learn something quickly under deadline. (STAR)",
    answer: "Highlight your structured approach to rapid learning: documentation first, minimal working proof-of-concept, and shipping under pressure.",
    code: `// Model Script:
• Situation: "During my capstone project, I needed to containerize my backend and database using Docker, a tool I had never used before, with only 4 days before demo week."
• Task: "I needed to write a working multi-stage Dockerfile and docker-compose.yml to run both Node.js and MongoDB reliably."
• Action: "Instead of watching 20 hours of general tutorials, I spent 3 hours on official Docker documentation, created a minimal 1-container Node prototype, and incrementally layered in environment variables and volume persistence."
• Result: "I successfully deployed the containerized app with GitHub Actions on schedule, and demoed the live containerized architecture smoothly."`,
    trap: "Demonstrate that you know how to learn efficiently (reading official documentation over passive video binging)."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "How do you handle disagreement with a senior engineer during code review?",
    answer: "Frame code review as a collaborative learning opportunity focused on code quality and business impact, never an ego battle.",
    code: `// Model Script:
"I welcome code review feedback as the fastest way to grow as a developer. If a senior engineer suggests a different approach, my first step is to genuinely understand their architectural reasoning—whether it's regarding edge cases, scalability, or team consistency.

If I had a specific reason for my implementation, I share my data or benchmarks politely in the PR comment. Ultimately, I defer to team conventions and senior guidance, make the changes cleanly, and document the rationale for future tickets."`,
    trap: "Never say 'I always do whatever the senior says immediately' (passive) or 'I fight to prove my code is right' (combative). Show respectful curiosity."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "Where do you see yourself in 2 to 3 years?",
    answer: "Focus on technical depth, engineering ownership, and mentoring entry-level developers within the company.",
    code: `// Model Script:
"In 2 to 3 years, my goal is to be a dependable, high-performing core engineer on your team. I want to have deep domain expertise in your product architecture, take full ownership of end-to-end features from database design to frontend UX, and contribute to code reviews and onboarding newer interns."`,
    trap: "Don't say 'I want to be a manager' or 'I want to start my own startup' or 'I want to do a Master's degree abroad'. Anchor your career in software engineering craftsmanship."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "Why are you interested in our company specifically?",
    answer: "Demonstrate that you did your homework on their specific tech stack, recent company news, or the engineering challenges of their business domain.",
    code: `// Model Script (Customized for Kerala Tech Parks / Product Companies):
"I have been following [Company Name]'s work in [Domain, e.g. Travel Tech / SaaS / Healthcare / FinTech]. I noticed in your recent engineering posts that you are building [Feature or Stack, e.g. scalable React/Node microservices]. 

Given my hands-on background building authenticated REST APIs and responsive UI architectures, your engineering standards align directly with what I have been training for. I want to contribute to products with real users rather than internal dummy exercises."`,
    trap: "Never give a generic answer like 'Because you are a reputed MNC'. Mention at least one specific product feature, tech stack, or engineering blog post."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "What are your salary expectations?",
    answer: "Anchor on research-backed market standards for freshers in your region, communicate flexibility, and emphasize that long-term learning curve is your primary priority.",
    code: `// Model Script:
"Based on current 2026 market benchmarks for full-stack MERN developers in the Kerala and South India region, freshers with a strong portfolio of deployed projects typically range between ₹3.5 to ₹5.5 LPA. 

That said, the engineering mentorship and learning curve on your team are my top priorities. I am open to discussing a fair package that aligns with your company structure for entry-level developers."`,
    trap: "Never give a single rigid number ('I need exactly 6 Lakhs') or undervalue yourself with 'Anything is fine, I will work for free'."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "What do you do when you are completely stuck on a technical problem?",
    answer: "Describe a disciplined 4-step escalation protocol: isolation, documentation search, rubber-ducking, and timely asking for help.",
    code: `// Model Script:
"1) Isolation: I isolate the failure in a clean test case or console log to pinpoint the exact line or network call failing.
2) Official Docs: I read the official library documentation and recent GitHub issues.
3) Time-box: I time-box my solo debugging to 45 minutes to avoid spinning wheels.
4) Asking with Context: If still blocked, I reach out to a senior or peer with a structured question: what I'm trying to achieve, what I already tried, and the exact error reproduction steps."`,
    trap: "Never say 'I immediately ask my lead' (interrupts seniors) or 'I struggle in silence for 3 days' (wastes company sprint time). Show time-boxing!"
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "Tell me about a time you made a mistake or failed. What did you learn? (STAR)",
    answer: "Pick a genuine technical mistake, demonstrate rapid ownership, describe the fix, and highlight the automated preventive guard you put in place.",
    code: `// Model Script:
• Situation: "Early in my backend practice, I accidentally committed an active MongoDB Atlas connection string containing my database password to a public GitHub repo."
• Task: "I had to prevent unauthorized database access immediately."
• Action: "I did not just delete the commit. I immediately revoked the database user credentials in MongoDB Atlas, generated a fresh secure password, removed the credentials from git history using git filter-repo, and added .env to my global .gitignore."
• Result: "I installed git-secrets hooks to prevent future accidental secret commits. The incident taught me the critical importance of security-first development."`,
    trap: "Never say 'I've never really made a mistake' or blame a team member. Interviewers look for humility, quick accountability, and post-incident prevention."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "Are you willing to relocate to Bengaluru, Chennai, or Hyderabad if required?",
    answer: "Express proactive enthusiasm for career growth while reaffirming readiness for Kerala or remote opportunities.",
    code: `// Model Script:
"Yes, absolutely. While I am currently based in Kerala and actively applying to Infopark and Technopark roles, I am 100% open and eager to relocate to Bengaluru, Chennai, Hyderabad, or wherever the team is headquartered to collaborate directly with the engineering team."`,
    trap: "Hesitating on relocation immediately eliminates candidates from 50%+ of South Indian product company hiring pipelines."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "How do you stay updated with rapidly changing web technologies and frameworks?",
    answer: "Cite specific authoritative resources, changelogs, podcasts, and personal building habits.",
    code: `// Model Script:
"I follow official release notes like the React, Node.js, and TypeScript GitHub releases. I regularly read frontend newsletters like JavaScript Weekly and ByteByteGo for system design. 

Most importantly, when a new standard is released (like React 19 Actions or Node.js native test runner), I build a small test script to experiment with it directly rather than just reading headlines."`,
    trap: "Avoid saying 'I watch tech influencers on Instagram/YouTube'. Cite official documentation, release changelogs, and personal proof-of-concept testing."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "Explain a complex technical concept (like API Authentication) to a non-technical person.",
    answer: "Use an intuitive, relatable real-world analogy (hotel keycards, coat-check tickets) without dropping jargon.",
    code: `// Model Script:
"Think of an API like a bank teller, and authentication like a passport. When you log in with your password, the server checks your ID and hands you a digital wristband or hotel room keycard (the token). 

For every subsequent request you make—like checking your account balance or withdrawing funds—you simply show the wristband. The teller verifies the stamp on the wristband in one second without having to re-inspect your passport or verify your identity from scratch every single time."`,
    trap: "Do not use words like 'cryptographic hash', 'hexadecimal', or 'stateless payload' when asked to explain to a non-technical person."
  },
  {
    category: "hr",
    categoryLabel: "🤝 HR & Behavioural",
    q: "Do you have any questions for us? (The 3 Winning Questions)",
    answer: "Always ask questions! Asking thoughtful reverse-interview questions signals curiosity, standards, and genuine enthusiasm.",
    code: `// 3 Winning Questions to Ask the Panel:
1. "What does the code review and deployment process look like for an entry-level engineer on your team?"
2. "What are the common technical challenges your team has faced recently as your user base grew?"
3. "If I join your team, what would success look like in my first 90 days?"`,
    trap: "Never say 'No, I have no questions' or ask 'How many leaves do I get?' in the first technical round."
  }
];

module.exports = { INTERVIEW_BANK };
