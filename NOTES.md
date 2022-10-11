### Questions to ask yourself when creating a test

- What to render?
  - what's the smallest component that encompasses the test?
- Do we need to pass any props?
- Do we need to wrap the component? ie ContextProvider
  - does the provider get used? Is it already wrapped within the component?
- Where should the tests go?
  - which file? New file needed?
- What to test?
  - What's the behavior that needs testing?
- How to test?
  - What queries and events?
- Do we need to await?
  - Is there anything async going on?
