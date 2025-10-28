# LearnLoop User Guide

## What is LearnLoop?
LearnLoop is an online application designed to support both students and tutors, enhancing the overall learning and teaching experience. Unlike existing tutoring platforms in Malaysia, LearnLoop offers a more inspiring set of interconnected features. In addition, it fosters a sustainable ecosystem that provides long-term value for users, ensuring continuous learning opportunities for everyone.

## 🧩 Key Features
- **[Forum](#forum)**: Communication platform between **tutors** and **students**
  - Tutors gain exposure via answering questions to get credits.
  - Students receive answers and basic guidances.
  - Students give an upvote for useful comments.

- **[Leaderboard](#leaderboard)**: Ranking platform to showcase high quality **tutors**.
  - Tutors will be ranked according to number of upvotes from students.
  - Students can recognize tutors with high credibility.
 
- **[Guided Learning](#guided-learning)**: Tutor selection platform for **students**.
    - Students can select their tutors by the dedicated filtering system according to subject, teaching style and ranking options.
    - Stdents can submit feedbacks of tutors to enhance the filtering system.
 
- **[Smart Learning](#smart-learning)**: Virtual AI tutoring platform for **students**.
  - Students can get subject material guidance through the AI chatbox.
  - Students can have their instant mock tests via the Mock Test Generator for self-reflection.
  - Students can get automatically generated flashcards to revise weak topics from the mock tests.
  - Students can use the Pomodoro Timer to track their study hours for each subject.
 
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
Once logged in, you will be directed to the main page, which features the Past Performance Dashboard and a **[sidebar](#sidebar)** for navigating to other features of LearnLoop. If you are the first user, the dashboard will display everything as blank. You will have to study by our **[Smart Learning Platform](#smart-learning)** to get a summary of your study performance.

< Image here >

<a id="sidebar"></a>
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

<a id="smart-learning"></a>
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
- Select Mock Test/ Flashcard / Pomodoro Timer.

<a id="mock-test"></a>
### ***📝 Mock Test***

< Image Here >

Once you finish answering the questions, the results will be shown and stored in the Past Performance Dashboard. Click the *Test again* if you wish to retake the mock test. Click the *Close* button if you wish to redirect to *Smart Learning* Page.

<a id="flashcards"></a>
### ***🗂️ Flashcards***

Suppose if you make mistakes in the mock test, the questions will be stored and shown in the form of flashcards.

< Image Here >

- Click or Press the *space* keyboard to flip the flashcards to get the answers.
- Click your feedback of the flashcard according to your understanding (Again/Hard/Good/Easy), or press the *(1,2,3,4)* keyboard buttons. The flashcard will be rearranged according to your understanding when you revise via flashcard again.
- Click the close button or press *Esc* to redirect to *Smart Learning* Page.

<a id="pomodoro-timer"></a>
### ***🍅 Pomodoro Timer***

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

To reach out this feature, click the icon of Past Performance Dashboard as shown in the sidebar. 

<table>
  <tr>
    <td><img src="frontend/src/assets/S%20image%201.png" alt="Past Performance Dashboard" width="40"/></td>
    <td><b>Past Performance Dashboard Icon</b><br></td>
  </tr>
</table>

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

<a id="predictive-decision-tree-model"></a>
### ***🤖 Predictive Decision Tree Model***

- Click the **Predictive Decision Tree Model** button in the [table](#functions-in-past-performance-dashboard) to open a **popup window** that displays the model interface.

< image here >

- Select the desired grade from the dropdown menu.
- Click the *Predict Probability* button to generate the result, then return to the Past Performance Dashboard by clicking the *Close* button.

<a id="forum"></a>
## 📚 Forum

The Forum is a communication platform for both students and tutors to ask and answer questions. It is mutually beneficial: students can have their questions answered, while tutors earn credits when their answers are liked by users.

To reach out this feature, click the icon of Forum as shown in the sidebar. 

<table>
  <tr>
    <td><img src="frontend/src/assets/S%20image%203.png" alt="Past Performance Dashboard" width="40"/></td>
    <td><b>Forum Icon</b><br></td>
  </tr>
</table>

< image here >

- Users can search for posts using the filter bar above.  
- The **+** button next to the filter bar allows users to create new posts.  
- Trending topics are displayed at the top-right corner.


<a id="Create-a-Post"></a>
### ***🖊️ Create a Post***

- Click the **+** button at the top-right of the interface.  
- Enter the subject and question in the popup window.  
- Submit your question by clicking the ***Post Question*** button.

<a id="Like-a-Post"></a>
### ***👍 Like a Post***

To like or see how many likes, refer to the table below:

<table>
  <tr>
    <td><img src="frontend/src/assets/like.png" alt="Like Button" width="30"/></td>
    <td><b>Like Button</b><br>Located at the bottom-right of each comment.</td>
  </tr>
</table>

<a id="Comment-a-Post"></a>
### ***💬 Comment a Post***

- To comment a post, click the entire cell of the comment, and it will be directed to the comment section. The number of comments are shown beside the comment icon.

<table>
  <tr>
    <td><img src="frontend/src/assets/comment.png" alt="Comment Button" width="30"/></td>
    <td><b>Comment Icon</b><br>Located at the bottom-right of each comment.</td>
  </tr>
</table>

< image here >

- Write your comment in the bottom-middle comment cell.  
- Click ***Post Comment*** to submit your comment.

<a id="Like-a-Comment"></a>
### ***❤️ Like a Comment***

- To like a comment on a post, follow a similar method to navigate to the comment section as shown in ***[Comment a Post](#comment-a-post)***.  
- Click the like button located at the right of each comment.

<a id="leaderboard"></a>
## 🏆 Leaderboard

Each like in the comment section of a post in the [Forum](#forum) is converted into an equal number of credits. Tutors with high interaction levels with students are displayed on the leaderboard as recognition for their contributions. This system encourages tutors to engage with students, fosters a sustainable learning ecosystem, and increases exposure and popularity for active tutors.

To reach out this feature, click the icon of Leaderboard as shown in the sidebar. 

<table>
  <tr>
    <td><img src="frontend/src/assets/S%20image%202.png" alt="Past Performance Dashboard" width="40"/></td>
    <td><b>Leaderboard Icon</b><br></td>
  </tr>
</table>

< image here >

- The ranking leaderboard contains the following information:  
  - Rank  
  - Tutor's name  
  - Number of credits  
  - Styles (classified by LLM in [Guided Learning](#guided-learning))  
  - Rating (average rating from students)

- To refresh the page, refer to the refresh button contain at the top-right of the interface.

<a id="guided-learning"></a>
## 👨‍🏫 Guided Learning

Guided Learning is the platform where students can select tutors using a dedicated filtering system and submit feedback to generate tutors’ styles and ratings. Additionally, tutor registration is managed through this interface.

To reach out this feature, click the icon of Forum as shown in the sidebar. 

<table>
  <tr>
    <td><img src="frontend/src/assets/S%20image%207.png" alt="Guided Learning" width="40"/></td>
    <td><b>Guided Learning</b><br></td>
  </tr>
</table>

< image here >

<a id="subject-filtering"></a>
### ***🔍 Subject Filtering***

- Users can filter tutors by selecting their preferred subject from the filtering bar at the top or by clicking the subject buttons.  
- The list of tutors will then be narrowed down based on the selected subjects.

<a id="tutor-feedback"></a>
### ***⭐ Tutor Feedback***

- Click the **+** button under the section of ***Trusted by Thousands — Hear from Our Alumni***

< image here >

- Fill in the dropout cells, choose your rating score and leave a comment in the popout window.
- Click the ***Submit Review***

<a id="find-tutor"></a>
### ***🕵️ Find a Tutor***

- Click the **Learn With Tutor** button located at the middle-bottom.
- Fill in your personal information and preferences at the popup window.

< image here >

- Select your prefered tutor by clicking ***Contact Tutor***.

< image here >

<a id="become-tutor"></a>
### ***🧑‍🏫 Become a Tutor***

- Click the **Become A Tutor** button located at the middle-bottom.
- Fill in your basic and detail information at the popup window.

< image here >

- Click ***Submit Application*** to submit your application form.

<a id="disclaimer"></a>

## Privacy and Data Protection Notice

### Purpose
This notice explains how LearnLoop collects, uses, and shares personal information of Students and Tutors in connection with its tutoring services.

### For Students
- Students acknowledge that their personal information will be shared with Tutors once they select a Tutor.  
- Students acknowledge that their personal information will be securely stored by LearnLoop.

### For Tutors
- Tutors acknowledge that their personal information, including full name, teaching experience, and hourly rates, will be publicly displayed.  
- Tutors acknowledge that their contact information, such as email and phone number, will be shared with Students once a tutoring arrangement is made.

### Responsibilities of LearnLoop
- LearnLoop is responsible for securely storing all personal information under its care.  
- LearnLoop will not use personal information for any purpose other than those explicitly mentioned in this notice.  
- LearnLoop complies with applicable data protection regulations.

## Disclaimer

### Purpose  
This Disclaimer sets out the limits of responsibility and liability of LearnLoop in relation to the services and features provided through the platform.  
LearnLoop is a prototype educational platform developed **solely for the CodeNection 2025 competition**. It is not a commercial product and is intended only for demonstration and evaluation purposes.

### General Notice  
- By using LearnLoop, Students and Tutors acknowledge and agree that the platform is an experimental prototype built for the CodeNection 2025.  
- LearnLoop incorporates artificial intelligence (AI), predictive models, and automated systems which may not always produce accurate, consistent, or reliable results.  
- LearnLoop makes no representation, warranty, or guarantee regarding the accuracy, completeness, performance, or reliability of such outputs.

### For Students  
- LearnLoop does not guarantee the accuracy of any predictive results displayed in the **[Past Performance Dashboard](#past-performance-dashboard)** and AI contents created in **[Smart Learning](#smart-learning)**.  
- Any grade prediction or performance forecast generated by the system is for **informational and self-reflective purposes only** and should not be relied upon as an exact or guaranteed outcome.  
- LearnLoop shall not be held responsible for any decision or action taken by Students based on these predictive results.  
- LearnLoop shall not be responsible for any loss, damage, or issue arising from Students voluntarily disclosing their personal information (including but not limited to bank account details or passwords) to Tutors.  
- LearnLoop is not responsible for any private communication, transaction, or relationship established directly between Students and Tutors outside the platform.

### For Tutors  
- LearnLoop does not guarantee the accuracy of any AI-based style classification, rating, or descriptive label generated for Tutors. These are automatically produced based on system data and are provided solely for indicative purposes.  
- LearnLoop shall not be held responsible for any error, misrepresentation, or perceived inaccuracy arising from such AI-generated classifications.  
- LearnLoop shall not be responsible for any loss, damage, or issue arising from Tutors voluntarily disclosing their personal information (including but not limited to bank account details or passwords) to Students.  
- LearnLoop is not responsible for any private communication, transaction, or relationship established directly between Tutors and Students outside the platform.

### Limitation of Liability  
- LearnLoop, to the fullest extent permitted by law, disclaims all liability for any direct, indirect, incidental, or consequential loss or damage arising from the use or inability to use the platform, including any reliance on AI-generated or predictive outputs.  
- Nothing in this Disclaimer limits any statutory rights or obligations that cannot be excluded under applicable Malaysian law.  
- If any provision of this Disclaimer is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

### Acknowledgment  
By accessing or using LearnLoop, Students and Tutors acknowledge that they understand and accept the inherent limitations of predictive and AI-generated information, and agree that LearnLoop cannot be held responsible for any inaccuracies or outcomes resulting from such automated systems.

### Competition Context  
- This platform was created as part of the CodeNection 2025 competition to showcase innovative use of AI and Machine Learning (ML) models in application development.
- All functionalities, including predictive dashboards and AI-generated content, are provided for demonstration purposes only and may not reflect final or commercial-grade performance.
- If any provision of this Disclaimer is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

### Acknowledgment  
By accessing or using LearnLoop, Students and Tutors acknowledge that they understand and accept the inherent limitations of predictive and AI-generated information, and agree that LearnLoop cannot be held responsible for any inaccuracies or outcomes resulting from such automated systems.

