# LearnLoop User Guide

## What is LearnLoop?
LearnLoop is an online application designed to support both students and tutors, enhancing the overall learning and teaching experience. Unlike existing tutoring platforms in Malaysia, LearnLoop offers a more inspiring set of interconnected features. In addition, it fosters a sustainable ecosystem that provides long-term value for users, ensuring continuous learning opportunities for everyone.

## 🧩 Key Features
- **[Forum](#forum)**: Communication platform between **tutors** and **students**
  - Tutors gain exposure via answering questions to get credits.
  - Students receive answers and basic guidances.
  - Students give an upvote for useful comments.

- **Leaderboard**: Ranking platform to showcase high quality **tutors**.
  - Tutors will be ranked according to number of upvotes from students.
  - Students can recognize tutors with high credibility.
 
- **Guided Learning**: Tutor selection platform for **students**.
    - Students can select their tutors by the dedicated filtering system according to subject, teaching style and ranking options.
    - Stdents can submit feedbacks of tutors to enhance the filtering system.
 
- **[Smart Learning](#smart-learning)**: Virtual AI tutoring platform for **students**.
    - AI chatbox for subject material guidance.
    - Instant Mock Test Generator for self-reflections.
    - Flashcards Generator to revise weak topics from mock test.
    - Pomodoro Timer to trace study hours for particular subject.
 
- **[Past Performance Dashboard](#past-performance-dashboard)**: Visualization platform that displays **students'** academic progress and performance statistics.
    - Students can identify their best and worst subjects, along with total study hours and average mock test accuracy to inform study performance.
    - Students can forecast the probability final grade of selected subject by Decision Tree model.

 ## 🆕 Sign up an account
- Sign up for LearnLoop [here](https://learnyloopy-jesshohohohos-projects.vercel.app/auth), by entering your email, and creating a username and password.
  - < Insert Image Here >
- Confirm your sign up by verifying the email sent to your inbox.
    - < Insert Image Here >
- After verification, you will be redirected to the sign-in page. Enter the same email and password you used to register with LearnLoop.

## 🔑 Log In to LearnLoop
Once logged in, you will be directed to the main page, which features the Past Performance Dashboard and a **[sidebar](##sidebar)** for navigating to other features of LearnLoop. If you are the first user, the dashboard will display everything as blank. You will have to study by our **[Smart Learning Platform](#smart-learning)** to get a summary of your study performance.

< Image here >

### ***📚 Sidebar*** 

The sidebar is always displayed on the left side of every page, allowing users to navigate to any page at any time. The table below provides explanations for each button in the sidebar.

<table align="center">
  <tr>
    <td><img src="frontend/src/assets/S%20image%201.png" alt="Past Performance Dashboard" width="60"/></td>
    <td><b>Past Performance Dashboard</b><br>Displays students' academic statistics and progress through clear visual summaries.</td>
  </tr>
  <tr>
    <td><img src="frontend/src/assets/S%20image%202.png" alt="Leaderboard" width="60"/></td>
    <td><b>Leaderboard</b><br>Highlights top-performing tutors based on their achievements and activity.</td>
  </tr>
  <tr>
    <td><img src="frontend/src/assets/S%20image%203.png" alt="Forum" width="60"/></td>
    <td><b>Forum</b><br>Provides a communication platform where tutors and students share questions, resources, and ideas.</td>
  </tr>
  <tr>
    <td><img src="frontend/src/assets/S%20image%206.png" alt="Smart Learning" width="60"/></td>
    <td><b>Smart Learning</b><br>Offers virtual tutoring support with study material guidance, mock tests, flashcards, and a pomodoro timer.</td>
  </tr>
  <tr>
    <td><img src="frontend/src/assets/S%20image%207.png" alt="Guided Learning" width="60"/></td>
    <td><b>Guided Learning</b><br>Enables students to select their preferred tutors through a dedicated filtering system.</td>
  </tr>
  <tr>
    <td><img src="frontend/src/assets/S%20image%208.png" alt="Exit" width="60"/></td>
    <td><b>Exit</b><br>Allows users to securely log out and end their session.</td>
  </tr>
</table>


## 🧠 Smart Learning

Smart learning is a virtual tutor platform to provide incentive revision based on the uploaded study materials. To use this feature, it is neccessary to provide your own study materials from your lecturer/teacher via format of .pdf, .txt or .docx. The intention of doing so is to give specific and reliable outcome from the LLM for revision purposes. The performance in mock test and study time will be stored and visualize in the [Past Performance Dashboard](#past-performance-dashboard).

To reach out this feature, click the icon of smart learning as shown in the sidebar. 

<table>
  <tr>
    <td><img src="frontend/src/assets/S%20image%206.png" alt="Smart Learning" width="40"/></td>
    <td><b>Smart Learning Icon</b><br></td>
  </tr>
</table>

You will be directed to the front page of smart learning platform as shown above. Next, click the upload icon as shown in buttom left in the *pick the subject* section. 

<table>
  <tr>
    <td><img src="frontend/src/assets/image-146.png" alt="Upload Button" width="40"/></td>
    <td><b>Upload Icon</b><br>Click this icon to reach the upload material page.</td>
  </tr>
</table>

When you reach the upload material page, you can insert your subject name and browse your study material from your device. Click submit to finalise your uploaded material.

If your material is uploaded successfully, it will be displayed in the *pick the subject* section.

< image here >

Now, your journey to use the features in Smart Learning begins! 

To use the features:
- Click the subject you wish to revision. The button will turn purple once you click it.
- Select Mock Test/ Flashcard / Pomogoro Timer.

### ***Mock Test***

< Image Here >

Once you finish answering the questions, the results will be shown and stored in the Past Performance Dashboard. Click the *Test again* if you wish to retake the mock test. Click the *Close* button if you wish to redirect to *Smart Learning* Page.

### ***Flashcards***

Suppose if you make mistakes in the mock test, the questions will be stored and shown in the form of flashcards.

< Image Here >

- Click or Press the *space* keyboard to flip the flashcards to get the answers.
- Click your feedback of the flashcard according to your understanding (Again/Hard/Good/Easy), or press the *(1,2,3,4)* keyboard buttons. The flashcard will be rearranged according to your understanding when you revise via flashcard again.
- Click the close button or press *Esc* to redirect to *Smart Learning* Page.

### ***Pomodoro Timer***

Suppose if you want to trace your study time, pomogoro timer will be your choice! It serves to record your study time, and remind you to take a rest. Clidk the button as shown below to be directed to the *Pomodoro Timer*

<table>
  <tr>
    <td><img src="frontend/src/assets/pomodoro.png" alt="Pomodoro Button" width="50"/></td>
    <td><b>Pomodoro Icon</b><br></td>
  </tr>
</table>

- Choose the subject you wish to revise.
- Press *Start 25-minute study session*
- Refer to the list of buttons below in *Pomogoro Timer*.

<table>
      <tr>
    <td><img src="frontend/src/assets/minimize-2.png" alt="Pomodoro Button" width="40"/></td>
    <td><b>Minimize the pomogoro tab</b><br></td>
  </tr>
  <tr>
    <td><img src="frontend/src/assets/Close.png" alt="Close Button" width="40"/></td>
    <td><b>Redirect completely to Smart Learning Page</b><br></td>
  </tr>
</table>


<a id="past-performance-dashboard"></a>
## 📋 Past Performance Dashboard

The summary of your performance from the **[Smart Learning Platform](#smart-learning)** is displayed on this Past Performance Dashboard page. The key function of this dashboard is a predictive decision tree model, which allows students to input their test and assignment scores along with data from the **[Smart Learning Platform](#smart-learning)** to predict the probability of achieving their desired grade in a subject.

< image here >

- The component above displays the summary of your study performance which are:
  - Best Subject
  - Worst Subject
  - Total Study Hour
  - Average Accuracy of Mock Test

- The component in the middle visualizes bar charts displaying the Test 1, Test 2, and Assignment scores (self-inserted), as well as the Mock Test and Study Hours (from the Smart Learning Platform). For extra remarks, study hour can also be manually inserted.

The component below displays information similar to that shown above. The action buttons in the rightmost column allow users to edit self-inserted values, delete entries, or navigate to the predictive decision tree model.

<a id="functions-in-past-performance-dashboard"></a>
### ***🔧 Functions in Past Performance Dashboard***

<table>
      <tr>
    <td><img src="frontend/src/assets/minimize-2.png" alt="Pomodoro Button" width="40"/></td>
    <td><b>Edit</b><br></td>
  </tr>
  <tr>
    <td><img src="frontend/src/assets/Close.png" alt="Close Button" width="40"/></td>
    <td><b>Delete</b><br></td>
  </tr>
    <tr>
    <td><img src="frontend/src/assets/Close.png" alt="Close Button" width="40"/></td>
    <td><b>Direct to predictive decision tree model</b><br></td>
  </tr>
</table>

<h3 id="Predictive Decision Tree Model">🤖 Predictive Decision Tree Model</h3> 

- Click the **Predictive Decision Tree Model** button in the [table](#functions-in-past-performance-dashboard) to open a **popup window** that displays the model interface.

< image here >

- Select the desired grade from the dropdown menu.
- Click the *Predict Probability* button to generate the result, then return to the Past Performance Dashboard by clicking the *Close* button.

<a id="forum"></a>
## 📚 Forum

Forum is a communication platform for
