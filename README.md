# Task Tracker App

The Task Tracker App is an intuitive, user-friendly web application that allows users to manage their tasks effectively, enhancing productivity and time management.

With this app, users can create a user account, add new tasks, delete tasks, edit tasks, set due dates, set priorities, set categories, and track task completion status.

## Features:

1. **User Account Creation:** Users can create their accounts by providing their username and password.
2. **Add New Tasks:** Users can easily add new tasks to their task list. Each task requires a title, a category and a priotiry. Optional: a description, a due date and a due date and time can be assigned.
3. **Delete Tasks:** Users can remove tasks from their list when they are no longer needed.
4. **Edit Tasks:** Users can modify the details of existing tasks, including the title, description, due date, priority, category, and status.
5. **Set Due Date:** Users can set due dates for their tasks to ensure timely completion.
6. **Set Priority:** Users can assign priorities to their tasks, such as urgent, high, medium, or low.
7. **Set Category:** Users can categorize tasks to organize them efficiently based on different aspects of their life or work.
8. **Track Status:** Users can update the status of their tasks as pending, ongoing, or done to monitor their progress.
9. **Sort Tasks:** Tasks can be sorted by priority, title, category,status, created on, due date and accomplished on, in both ascending and descending order. Sorting is cumulative, meaning that if tasks have equal values for the field they are being sorted by, the previous sorting criteria will be applied as secondary criteria.
10. **Filter Tasks:** Tasks can be filtered by:

- **Keyword(s):** Display tasks containing the specified keywords within their content, including dates, status, and priority.
- **Field:** Display tasks within specific categories, priorities, statuses, or date ranges for their due date, created on, and accomplished on attributes.

## Usage:

1. **Create an Account:** Sign up for a new user account by providing your name, email, and password.
2. **Log In:** Log in with your account credentials to access your task list.
3. **Add a New Task:** Click on the "New Task" button and fill in the required details like title, description, due date, priority, and category. Click "Ok" to add the task to your list. The "created on" attribute will be assigned automatically.
4. **Edit a Task:** To edit a task, display the task info by clicking the expand/collapse button next to the title, and then click on the "Edit" button: this will allow editing the different fields. Click on the pencil to edit the desired field and then click "Apply". Click "Done" to deactivate the editing options.
5. **Set Priority:** When adding or editing a task, choose the priority level from the options: urgent, high, medium, or low.
6. **Set Category:** Assign a category to the task from the available categories, or creating a new one.
7. **Set Status:** Update the status of a task to pending, ongoing, or done based on its progress. When the status is set as "done", the "accomplished on" date will be assigned automatically. If the status is changed back to "pending" or "ongoing", the "accomplished on" date will be reomoved.
8. **Delete a Task:** To remove a task from the list, click the "Delete" button in the lower part of the task's content.
9. **Filtering by Keyword Functionality:**
   Filtering by keyword(s) will display tasks containing the specified keywords within their content. This includes their title, category, description, priority, status, as well as created on, accomplished on or due by dates.

   To better leverage the searching functionality, you can apply "and" or "conditionals" by using the "&" and "|" characters respectively.

   For example:

- Searching "task & ongoing" will display all tasks containing the keywords "task" and "ongoing" anywhere in their content, but not necessarily contiguously.
- Searching "task | ongoing" will display all tasks containing the keywords "task" or "ongoing" anywhere in their content

  If none of these characters are used, the input will be read as a continuous string.
