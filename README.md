<h1 align="center" id="title">Memo Test Game</h1>

<p align="center" id="description">A memo test game developed using NextJS, React and Tailwind CSS.</p>

<h2>📝 Requirements:</h2>
<p>This game will be composed of a few pages:</p>
<b>Home:</b>
<p>Simple list of memo tests with a button ‘Start’ to start a new session for that memo test or ‘Continue’ to continue an already created and unfinished session stored in some front-end storage</p>
<ul><li>The list of memo tests should display the highest score that was reached in some of the sessions for that game</li></ul>
<b>Solve memo test (session):</b>
<p>A page containing a list of images (2 copies per image) hidden with a number sorted in random order</p>
<ul><li>In the beginning, you will see a covered card with a number. The user will be able to click on any card to uncover the image (it should have some animation) and will be able to uncover two at a time</li>
<li>If they are the same image, they should remain uncovered for the rest of the session</li>
<li>If they are different, they both should flip again to the black card with the number</li>
<li>Each time a pair of cards is selected the retries in the session should be updated</li>
</ul>
<b>Score:</b>
<p>Once all pairs have been uncovered the session should end and show a score calculated like this: score = (numberOfPairs / retries) * 100 and a button to return to the Home
</p>

<p><i>
The information of an ongoing session or the highest scores per game should persist if there is a browser refresh.</i></p>

<h2>🛠️ Installation Steps:</h2>

<p>1. Install dependencies</p>

```
npm install
```

<p>2. Create an .env file in project root using .env.example</p>

```
cp .env.example .env
```

<p>3. Run server</p>

```bash
npm run dev
```

<h2>📕 Storybook</h2>

<p>1. Run storybook</p>

```
npm run storybook
```

<p>2. Go to</p>

```
http://localhost:6006/
```

<h2>💖Like my work?</h2>

Feel free to reach me out - icapodanno@gmail.com
