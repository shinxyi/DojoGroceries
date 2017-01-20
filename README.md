# DojoGroceries

## Features

- First user to log in is automatically set to admin level 9, making them an admin.
- All following users to log in are set to admin level 0, making them unapproved and thus unable to access their account. (Admin must approve their account. This is a preventative measure to make sure that random people aren't coming by the site and creating accounts to skew the poll stats/ students aren't making duplicate accounts to skew poll stats.)
- Items can be created. (Walmart API integration and Sam's Club still need to be fixed...)
- Users can vote on items suggested for this week (if you click vote, the vote will go up, if you click it again, you'll "unvote"). If the vote count is colored green, you've already voted. If it's yellow, you haven't.
- Items with at least 1 vote will be suggested for this week's grocery list. If the vote count drops below 1, it is un-suggested for the week.
- Items suggested for the week are ordered by popular vote.
- "Database" tab only shows items that have not been suggested for this week. (Week is denoted by the last closest Sunday)
- Users can comment on items. Only comments from this week will be shown.

### Things to come...

(All these features have already been implemented server-side and are fully functional. A front-end component is needed to be wired up to these... API calls have been tested with [these Postman calls](https://www.getpostman.com/collections/567794b7c8ce8f1d4786))

- Sam's Club and Walmart API fix.
- Protect routes.
- Users should be able to delete comments if they wrote it.
- Users can flag other people's comments.


- **Admin Dashboard:**
	- Setting and editing the weekly budget.
	- Inbox for reviewing flagged comments.
	- Inbox for reviewing new members that need approval.
	- Adding suggested items to this week's grocery list.
	- Removing items off grocery list.
	- Marking items on grocery list as bought.
	- Adding/deleting categories.
	- Viewing all users and editing admin levels. (Admin Level of 0 = un-approved/inactivated)
	- Editing any item.
