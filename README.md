React Posts Cards

This is a small React app that fetches posts from https://jsonplaceholder.typicode.com/posts
and displays them as cards.

Features:
The app fetches posts and shows them in card format. It has loading and error states, and you can choose whether to show or hide the post body. A badge appears when the post body is longer than 120 characters. The PostCard component receives the title, body, showBody, and highlight properties.

How to run:
Open PowerShell, go to the project folder (for example: cd d:\Test1), run npm install, then run npm run dev. After that, open the URL shown in the terminal (usually http://localhost:5173
).

Notes:
The project is built using Vite. It can be converted to Create React App if needed.

Pagination:
The app displays 10 posts per page. You can move between pages using the Previous, Next, and numbered page buttons at the bottom.

Edit controls:
Each post on the current page has action options: Edit, Delete, Disable or Enable, and Add After.
Edit lets you modify the title and body inline, with Save and Cancel options.
Delete removes the post after confirmation.
Disable marks a post as disabled, greying it out and disabling actions except Enable.
Add After allows you to insert a new post directly after the current one.

You can also add a new post at the top using the Add New Post option.

Search:

- Use the search box in the header to filter cards by title (case-insensitive).
- Pagination updates to the filtered results and the search can be cleared with the "Clear" button next to the input.
