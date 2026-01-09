// --- 1. SETUP & UTILS ---
console.log("Script loaded. Using LocalStorage for database.");

// --- 2. NAVBAR SCROLL EFFECT ---
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow');
        } else {
            navbar.classList.remove('shadow');
        }
    });
}

// --- 3. ADMIN PAGE: Save Blog Post ---
const blogForm = document.getElementById('blogForm');
if (blogForm) {
    blogForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const submitBtn = blogForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Publishing...";
        submitBtn.disabled = true;

        // Create the new blog object
        const newBlog = {
            id: Date.now(), // Unique ID based on time
            title: document.getElementById('title').value,
            image: document.getElementById('imageUrl').value,
            category: document.getElementById('category').value,
            desc: document.getElementById('desc').value,
            timestamp: new Date().toLocaleString()
        };

        try {
            // Get existing blogs from LocalStorage or start empty
            const existingBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
            
            // Add new blog to the beginning of the array
            existingBlogs.unshift(newBlog);

            // Save back to LocalStorage
            localStorage.setItem('blogs', JSON.stringify(existingBlogs));

            setTimeout(() => {
                alert("✅ Blog Published Successfully!");
                blogForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 800); // Small fake delay for effect

        } catch (error) {
            console.error("Error saving blog: ", error);
            alert("❌ Error: " + error.message);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// --- 4. BLOG PAGE: Load Posts ---
const blogContainer = document.getElementById('blogContainer');
if (blogContainer) {
    function loadBlogs() {
        console.log("Fetching blogs from LocalStorage...");
        
        // Get data
        const blogs = JSON.parse(localStorage.getItem('blogs')) || [];

        if (blogs.length === 0) {
            blogContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h4 class="text-secondary">No blogs found.</h4>
                    <p class="text-secondary">Go to the <a href="admin.html" class="text-gold">Admin Page</a> to add your first post!</p>
                </div>`;
            return;
        }

        blogContainer.innerHTML = ""; 

        blogs.forEach((blog) => {
            const html = `
                <div class="col-md-4">
                    <div class="card h-100">
                        <img src="${blog.image}" class="card-img-top" style="height: 250px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/400x250?text=Image+Not+Found'">
                        <div class="card-body">
                            <span class="badge bg-warning text-dark mb-2">${blog.category}</span>
                            <h5 class="card-title text-white">${blog.title}</h5>
                            <p class="card-text text-secondary">${blog.desc}</p>
                            <small class="text-muted" style="font-size: 0.8em">Posted: ${blog.timestamp}</small>
                        </div>
                        <div class="card-footer border-top border-secondary">
                             <button onclick="deleteBlog(${blog.id})" class="btn btn-sm btn-outline-danger w-100">Delete Post</button>
                        </div>
                    </div>
                </div>
            `;
            blogContainer.innerHTML += html;
        });
    }
    
    // Run immediately
    loadBlogs();
}

// --- 4.5 DELETE FUNCTION (Global) ---
window.deleteBlog = function(id) {
    if(confirm("Are you sure you want to delete this post?")) {
        const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        const filteredBlogs = blogs.filter(blog => blog.id !== id);
        localStorage.setItem('blogs', JSON.stringify(filteredBlogs));
        location.reload(); // Refresh page to see changes
    }
};

// --- 5. CONTACT PAGE: Save Message ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button');
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        const newMessage = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toLocaleString()
        };

        // Save to LocalStorage (simulating a backend)
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push(newMessage);
        localStorage.setItem('messages', JSON.stringify(messages));

        setTimeout(() => {
            alert("✅ Message Sent! (Check console or LocalStorage to see it)");
            console.log("New Message Received:", newMessage);
            contactForm.reset();
            submitBtn.textContent = "Send Message";
            submitBtn.disabled = false;
        }, 1000);
    });
}