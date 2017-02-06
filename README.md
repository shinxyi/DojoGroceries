# Fūdo Dojo ("Food Room")

Fūdo Dojo is a web application that will allow students of the Coding Dojo to submit items to a weekly 'election' (AKA "suggestions list"). From this election, students can vote on globally submitted items that they desire to see purchased for their consumption in the kitchen. At it's most basic level, the app will be able to 1) properly register and login users and administrators; 2) accept an item id or UPC number and use that number to pull information from Wal-mart's or Sam's Club's website and then populate a database with that information; 3) create a new Suggestions List ('election') every week that users can vote and comment on; and 4) allow administrators to create grocery lists based on weekly user feedback from Suggestions.

## Features

### Users and Login/Registration

- Properly register and login users with validation.
- First user to register in database will be registered as an 'administrator' ("admin") level user. Following users can be given admin status by the original admin user or other admin users thereafter.
- Follow up users must first be 'approved' by an admin before being allowed to login into the application. Users can also be 'deactivated' by an admin.
- Admin will have ability to batch process/approve new users.

### Product Creation

- Item ID or UPC number inputs can be accepted which will result in a query to Wal-Mart's OpenAPI platform. The returned information can then be captured into the database as an item eligible for voting on if the users approves of it.
- Users and admins can create custom products with text inputs for predefined product fields.
- Product schema will have a field called 'quantity' that can be defined by the user creating the item.
- Admin can edit and delete all products from the database.

### Comments and Interactions

- Users can place comments on products (and delete them if they created the comment) that have been suggested for Suggestion List.
- Users can flag comments that were not created by them.
- Admin can to delete any comment, and will have a portal to view flagged comments.

###  Grocery List / Elections

- Each week the Suggestions List is automatically reset. This list will eventually be populated by users with products that they wish to see purchased.
- These products can be voted on by individuals users, and will be sorted by the number of votes that they have accrued.
- Users will only be allowed to place one vote on each individual item per week (with an unlimited number of votes per week). Users can also revoke votes.
- Users can designate certain products as 'favorites.' These are displayed as a sidebar on the Suggestions List page for users to easily find all favorited items to vote on for that week.
- Administrators can designate certain products to be persisted. These products will automatically be added to each new grocery list without any user interaction whenever a new grocery list is generated.
- The admin can add and remove products from the week's grocery list.

### Reports
- Admins can view a historical stat page.
- The admin can establish a budget which is displayed to the admin in their navigation bar along with the remaining amount of money from their budget. The remaining amount of money left over is based on items and their quantities added by the admin to the grocery list.
- Users can view information on the total votes and comments they've contributed to the application.
