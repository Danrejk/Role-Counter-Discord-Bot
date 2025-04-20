# Role Counter Discord Bot
This project is a custom Discord bot I developed to meet the very specific needs of one Discord server. The main goal was to create a tool that dynamically counts users assigned to particular roles and updates a message in real time to reflect those counts. Beyond just counting, it also supports linking roles and automates certain server-specific workflows.

## What I Achieved
Dynamic Role Counting: Implemented a system that listens to role changes in the server and updates a single message to show the current number of users per role. This required efficient handling of Discord’s Gateway Intents and managing real-time updates without excessive API calls.

- Custom Role Linking: Developed functionality to link roles together, enabling the server to manage role relationships programmatically.
- Server-Specific Tailoring: Unlike generic bots, this project was built from the ground up for one server’s exact requirements, which meant designing custom logic and workflows that wouldn’t necessarily apply elsewhere.
- Efficient Event Handling: Leveraged Discord.js event listeners to track member updates, ensuring the bot only updates the message when necessary, minimizing rate limits and API overhead.
- Message Management: Created a system to update a single message continuously rather than sending new messages, keeping the channel clean and user-friendly.

## Technical Highlights
- Written in JavaScript using the Discord.js library.
- Utilizes Discord Gateway Intents, especially GUILD_MEMBERS, to track role changes.
- Implements logic to debounce rapid updates and batch changes efficiently.
- Designed to be lightweight and focused solely on role counting and display.
- Configured for easy deployment and running on a Node.js environment.
- Cashing role emojis in a separate discord server for lesser API loads.

## Why This Project?
- This bot was not intended as a general-purpose tool but rather as a demonstration of solving a very specific problem with custom code. It showcases my ability to:
- Understand and utilize Discord’s API and event system deeply.
- Write efficient, event-driven code tailored to real-time data updates.
- Design software that fits unique, narrow requirements without unnecessary complexity.
