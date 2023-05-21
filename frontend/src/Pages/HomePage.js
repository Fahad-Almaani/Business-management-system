import React from 'react'
// import './styles.css'
export default function HomePage(){
  return (
    <div className="homepag">
       <header>
        <nav>
            <ul>
            {/* <li><a href="#">Home</a></li> */}
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            </ul>
            <div className="auth-links">
                <a href="/login/">Login</a>
                <a href="/signup">Sign Up</a> 
            </div>
        </nav>
        </header>
      
        <main>
            
            <section className="hero">
                <div className="logo" >
                    <img src="../static/images/logo.png" alt="logo"/>
                </div>
                <h2>Welcome to Business Managment Website</h2>
                <p>We help you to successed.</p>
                {/* <a href="#" className="cta">Learn More</a> */}
            </section>
        </main>
            <section className="features">
           
                <section>
                    <h2>Why BMS website?</h2>
                    <p>As the business grow books and spreadsheet aren't efficient enough, That is where we can help!</p>
                    </section>
                <section>
                    <h2>What We Offer?</h2>
                    <p>Books organization, Profits and Expenses Calculating, Employee management, multi branches supported</p>
                    </section>
                <section>
                    <h2>How To use?</h2>
                    <p>Register now a new account with new business. Start adding your branches and employees, register business data and start using the website</p>
                </section>

        </section>
        
      
        <footer>
            <p>&copy; 2023 Businees Management. All rights reserved.</p>
        </footer>
    </div>
  )
  }
