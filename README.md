# Overview
I was blessed with the experience to study abroad at Oxford University. I was one of only two students from Fordham who were accepted to do the exchange and the only one who went, the other girl was worried it would get canceled due to covid, so she canceled it for herself...

Anyways.

While I was there I picked up the gambling bug at the Oxford Poker Society. It was an organisation (notice the spelling of 'organization') of roughly 30-50 students during any one term and we meet weekly for low-stakes cash games somewhere on campus, try getting that approved at a Jesuit institution like Fordham. It was beautiful, each hand we talked about odds and could have calculators at the table. After Oxford, I stayed in Europe for 8 weeks. I traveled to a new city every other day with a Eurorail pass, staying in hostels, and playing poker in every damn city. There were swings, but I stayed extremely patient and only played when I knew there was a profitable strategy to execute. After 8 weeks I had profited $3,220 (after conversion fees). I had spent, $5,800 on the entire trip including Oxford and the subsequent 8 weeks. Not bad. 

This is where I became interested in the science that beat humans in the game of texas hold em developed by Noam Brown https://noambrown.github.io/. Before developing the programs that beat professionals at the game of no limit texas hold em, he was an algo trader at MJM here in new york. He now works as a research scientist at Meta. This project came from my fascination with his work. This work was later adorned by Eric Steinberger, another hero of mine, however, this implementation follows Noam Brown's algorithm.

# Situation
Say I was a curious cat. As all curious cats do, they want to learn about the algorithms we have to solve imperfect information games. I want to go to a site, click run, and see a visualization of the algorithm run. 

## This is an implementation and Visualization of the Machine Learning Algorithm used in Game Theory Optimal(GTO) Solvers for imperfect information games like Poker.

Access Link at: https://jhoward39.github.io/cfr/

The interactivity is still in the works. After hitting trained and waiting 30 seconds this is what one will see.

<img width="1301" alt="Screenshot 2023-01-20 at 12 37 16 PM" src="https://user-images.githubusercontent.com/70383367/213766669-5da9c1b9-1b43-4bf4-a237-2299e8fcae75.png">

This is the vanilla implementation of this algorithm. In order to handle big imperfect information games one needs to opt for the more efficient Deep CFR(Noam Brown 2018) or Single-Deep CFR(Eric Steinberger 2019)
