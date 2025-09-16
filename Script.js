        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyCmoCBKxxd2Bb-zXIPUJ7KkpU6YD87KVbM",
            authDomain: "appy-62b54.firebaseapp.com",
            databaseURL: "https://appy-62b54-default-rtdb.firebaseio.com",
            projectId: "appy-62b54",
            storageBucket: "appy-62b54.firebasestorage.app",
            messagingSenderId: "492189644834",
            appId: "1:492189644834:web:7a320b550c0fa35a86b27b",
            measurementId: "G-13W9SSYDCL"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();

        // DOM elements
        const loadingScreen = document.getElementById('loadingScreen');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const authScreen = document.getElementById('authScreen');
        const appScreen = document.getElementById('appScreen');
        const logoutBtn = document.getElementById('logoutBtn');
        const profileLogoutBtn = document.getElementById('profileLogoutBtn');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const profileAvatar = document.getElementById('profileAvatar');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const postContent = document.getElementById('postContent');
        const postBtn = document.getElementById('postBtn');
        const postsList = document.getElementById('postsList');
        const profilePostsList = document.getElementById('profilePostsList');
        const notification = document.getElementById('notification');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        const sidebarMenu = document.querySelectorAll('.sidebar-menu a');
        const contentTabs = document.querySelectorAll('.content-tab');
        const tabPanes = document.querySelectorAll('.tab-pane');
        const chatMessages = document.getElementById('chatMessages');
        const messageInput = document.getElementById('messageInput');
        const messageSend = document.getElementById('messageSend');
        const conversationList = document.getElementById('conversationList');
        const statPosts = document.getElementById('statPosts');
        const statLikes = document.getElementById('statLikes');
        const statComments = document.getElementById('statComments');
        const chatUserAvatar = document.getElementById('chatUserAvatar');
        const chatUserName = document.getElementById('chatUserName');
        const chatUserStatus = document.getElementById('chatUserStatus');
        const messageUserBtn = document.getElementById('messageUserBtn');
        const closeChatBtn = document.getElementById('closeChatBtn');
        const fullScreenChat = document.getElementById('fullScreenChat');
        const fullScreenChatUserAvatar = document.getElementById('fullScreenChatUserAvatar');
        const fullScreenChatUserName = document.getElementById('fullScreenChatUserName');
        const fullScreenChatUserStatus = document.getElementById('fullScreenChatUserStatus');
        const fullScreenChatMessages = document.getElementById('fullScreenChatMessages');
        const fullScreenMessageInput = document.getElementById('fullScreenMessageInput');
        const fullScreenMessageSend = document.getElementById('fullScreenMessageSend');
        const closeFullScreenChatBtn = document.getElementById('closeFullScreenChatBtn');
        const refreshConversationsBtn = document.getElementById('refreshConversationsBtn');
        const refreshChatBtn = document.getElementById('refreshChatBtn');
        const refreshFullScreenChatBtn = document.getElementById('refreshFullScreenChatBtn');
        const editDescriptionBtn = document.getElementById('editDescriptionBtn');
        const descriptionForm = document.getElementById('descriptionForm');
        const descriptionTextarea = document.getElementById('descriptionTextarea');
        const saveDescriptionBtn = document.getElementById('saveDescriptionBtn');
        const cancelDescriptionBtn = document.getElementById('cancelDescriptionBtn');
        const userDescriptionContent = document.getElementById('userDescriptionContent');
        const userProfileDescription = document.getElementById('userProfileDescription');

        // State variables
        let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        let currentFeed = 'all';
        let allPosts = [];
        let allUsers = [];
        let userLikes = {};
        let currentChatUser = null;
        let conversations = {};
        let editingMessageId = null;
        let currentChatType = 'inline'; // 'inline' or 'fullscreen'
        let dataLoaded = false;
        let userDescription = '';
        let lastActivityTime = Date.now();

        // Simulate loading process with database initialization
        function simulateLoading() {
            let progress = 0;
            const loadingInterval = setInterval(() => {
                progress += 5; // Increment by 5% every 1 second
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(loadingInterval);
                    
                    // Ensure data is loaded before showing app
                    if (dataLoaded) {
                        setTimeout(() => {
                            loadingScreen.classList.add('hidden');
                            if (currentUser) {
                                showAppScreen(currentUser);
                            } else {
                                authScreen.style.display = 'flex';
                            }
                        }, 500);
                    }
                }
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
            }, 1000); // Update every second for 20 seconds (100/5 = 20)

            // Initialize database data during loading
            initializeDatabaseData();
        }

        // Initialize database with sample data
        function initializeDatabaseData() {
            // This function simulates loading data from the database
            // In a real app, this would be actual database calls
            setTimeout(() => {
                // Simulate loading users
                loadAllUsers();
                
                // Simulate loading posts
                loadPosts();
                
                // Simulate loading likes
                if (currentUser) {
                    loadUserLikes(currentUser.id);
                    loadUserDescription(currentUser.id);
                }
                
                // Mark data as loaded
                dataLoaded = true;
            }, 15000); // Simulate 15 seconds of data loading
        }

        // Start loading simulation when page loads
        window.addEventListener('load', simulateLoading);

        // Auto logout after 45 minutes of inactivity
        function setupAutoLogout() {
            const logoutTimer = setInterval(() => {
                const currentTime = Date.now();
                const timeSinceLastActivity = currentTime - lastActivityTime;
                
                // 45 minutes in milliseconds
                if (timeSinceLastActivity > 45 * 60 * 1000) {
                    clearInterval(logoutTimer);
                    logoutUser();
                }
            }, 60000); // Check every minute
            
            // Update last activity time on user interaction
            document.addEventListener('click', () => {
                lastActivityTime = Date.now();
            });
            
            document.addEventListener('keypress', () => {
                lastActivityTime = Date.now();
            });
        }

        // Event listeners for new buttons
        refreshConversationsBtn.addEventListener('click', loadConversations);
        refreshChatBtn.addEventListener('click', refreshCurrentChat);
        refreshFullScreenChatBtn.addEventListener('click', refreshCurrentChat);

        // Message input event listeners for enabling/disabling send button
        messageInput.addEventListener('input', toggleSendButton);
        fullScreenMessageInput.addEventListener('input', toggleFullScreenSendButton);

        // Description form event listeners
        editDescriptionBtn.addEventListener('click', showDescriptionForm);
        saveDescriptionBtn.addEventListener('click', saveUserDescription);
        cancelDescriptionBtn.addEventListener('click', hideDescriptionForm);

        // Function to toggle send button based on input content
        function toggleSendButton() {
            messageSend.disabled = messageInput.value.trim() === '';
        }

        function toggleFullScreenSendButton() {
            fullScreenMessageSend.disabled = fullScreenMessageInput.value.trim() === '';
        }

        // Function to show description form
        function showDescriptionForm() {
            descriptionForm.style.display = 'block';
            descriptionTextarea.value = userDescription;
            editDescriptionBtn.style.display = 'none';
        }

        // Function to hide description form
        function hideDescriptionForm() {
            descriptionForm.style.display = 'none';
            editDescriptionBtn.style.display = 'inline-block';
        }

        // Function to save user description
        function saveUserDescription() {
            const newDescription = descriptionTextarea.value.trim();
            
            if (newDescription.length > 500) {
                showNotification('Description must be less than 500 characters!', 'error');
                return;
            }
            
            const userRef = database.ref('users/' + currentUser.id);
            userRef.update({
                description: newDescription
            }).then(() => {
                userDescription = newDescription;
                userDescriptionContent.textContent = newDescription || 'No description added yet.';
                hideDescriptionForm();
                showNotification('Description updated successfully!', 'success');
            }).catch(error => {
                console.error("Error updating description:", error);
                showNotification('Error updating description. Please try again.', 'error');
            });
        }

        // Switch between login and register forms
        loginTab.addEventListener('click', function () {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });

        registerTab.addEventListener('click', function () {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
        });

        // Sidebar menu navigation
        sidebarMenu.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                sidebarMenu.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                const tab = this.dataset.tab;
                if (tab === 'home') {
                    showContentTab('feed');
                } else if (tab === 'profile') {
                    showContentTab('my-posts');
                    loadProfileStats(currentUser.id);
                } else if (tab === 'messages') {
                    showContentTab('chat');
                    loadConversations();
                } else if (tab === 'discover') {
                    showContentTab('feed');
                }
            });
        });

        // Content tabs navigation
        contentTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                contentTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const content = this.dataset.content;
                showContentTab(content);
                if (content === 'my-posts') {
                    loadProfileStats(currentUser.id);
                } else if (content === 'chat') {
                    loadConversations();
                } else if (content === 'feed') {
                    filterPosts();
                }
            });
        });

        // Login form submission
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            loginUser(email, password);
        });

        // Register form submission
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            registerUser(name, email, password);
        });

        // Logout buttons
        logoutBtn.addEventListener('click', logoutUser);
        profileLogoutBtn.addEventListener('click', logoutUser);

        // Post button
        postBtn.addEventListener('click', function () {
            const content = postContent.value.trim();
            const privacy = document.querySelector('input[name="privacy"]:checked').value;
            if (content) {
                createPost(content, privacy);
            } else {
                showNotification('Please write something before posting!', 'error');
            }
        });

        // Search functionality
        searchInput.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            const results = allUsers.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
            displaySearchResults(results);
        });

        // Message send button
        messageSend.addEventListener('click', sendMessage);

        // Message input enter key
        messageInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Full screen message send button
        fullScreenMessageSend.addEventListener('click', sendFullScreenMessage);

        // Full screen message input enter key
        fullScreenMessageInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendFullScreenMessage();
            }
        });

        // Message user button
        messageUserBtn.addEventListener('click', function () {
            const userId = this.dataset.userId;
            const userName = this.dataset.userName;
            const user = { userId, userName };
            openChat(user, 'fullscreen');
        });

        // Close chat buttons
        closeChatBtn.addEventListener('click', closeChat);
        closeFullScreenChatBtn.addEventListener('click', closeFullScreenChat);

        // Function to handle logout
        function logoutUser() {
            // Update user status to offline
            if (currentUser) {
                const userRef = database.ref('users/' + currentUser.id);
                userRef.update({
                    status: 'offline',
                    lastSeen: firebase.database.ServerValue.TIMESTAMP
                });
            }
            
            localStorage.removeItem('currentUser');
            currentUser = null;
            authScreen.style.display = 'flex';
            appScreen.style.display = 'none';
            fullScreenChat.classList.remove('active');
            loginTab.click();
            showNotification('You have been logged out successfully.', 'success');
        }

        // Function to show notification
        function showNotification(message, type = 'success') {
            notification.textContent = message;
            notification.className = 'notification';
            notification.classList.add('show', type);
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Function to show content tab
        function showContentTab(tabId) {
            tabPanes.forEach(pane => {
                pane.style.display = 'none';
            });
            if (tabId === 'feed') {
                document.getElementById('feedContent').style.display = 'block';
            } else if (tabId === 'my-posts') {
                document.getElementById('profileContent').style.display = 'block';
            } else if (tabId === 'chat') {
                document.getElementById('messagesContent').style.display = 'block';
                document.getElementById('chatContent').style.display = 'none';
            } else if (tabId === 'user-profile') {
                document.getElementById('userProfileContent').style.display = 'block';
            }
        }

        // Function to refresh the current chat
        function refreshCurrentChat() {
            if (!currentChatUser) return;

            // Show refreshing animation
            const refreshBtn = currentChatType === 'inline' ? refreshChatBtn : refreshFullScreenChatBtn;
            refreshBtn.classList.add('refresh');
            if (currentChatType === 'inline') {
                loadMessages(currentChatUser.userId);
            } else {
                loadFullScreenMessages(currentChatUser.userId);
            }

            // Remove animation after 1 second
            setTimeout(() => {
                refreshBtn.classList.remove('refresh');
            }, 1000);
        }

        // Function to register a new user
        function registerUser(name, email, password) {
            const usersRef = database.ref('users');
            usersRef.orderByChild('email').equalTo(email).once('value', snapshot => {
                if (snapshot.exists()) {
                    showNotification('User with this email already exists!', 'error');
                } else {
                    const newUserRef = usersRef.push();
                    const userId = newUserRef.key;
                    const userData = {
                        id: userId,
                        name: name,
                        email: email,
                        password: password, // Note: Plain text password for simplicity; use proper hashing in production
                        createdAt: new Date().toISOString(),
                        status: 'online',
                        lastSeen: firebase.database.ServerValue.TIMESTAMP,
                        description: ''
                    };
                    newUserRef.set(userData)
                        .then(() => {
                            showNotification('Account created successfully!', 'success');
                            loginTab.click();
                            document.getElementById('loginEmail').value = email;
                            document.getElementById('loginPassword').value = password;
                        })
                        .catch(error => {
                            console.error("Error creating user:", error);
                            showNotification('Error creating account. Please try again.', 'error');
                        });
                }
            });
        }

        // Function to login user
        function loginUser(email, password) {
            const usersRef = database.ref('users');
            usersRef.orderByChild('email').equalTo(email).once('value', snapshot => {
                if (snapshot.exists()) {
                    let userFound = false;
                    snapshot.forEach(childSnapshot => {
                        const user = childSnapshot.val();
                        if (user.password === password) {
                            userFound = true;
                            // Update user status to online
                            const userRef = database.ref('users/' + user.id);
                            userRef.update({
                                status: 'online',
                                lastSeen: firebase.database.ServerValue.TIMESTAMP
                            });
                            
                            localStorage.setItem('currentUser', JSON.stringify(user));
                            showAppScreen(user);
                            showNotification('Login successful!', 'success');
                            setupAutoLogout(); // Setup auto logout after login
                            return true;
                        }
                    });
                    if (!userFound) {
                        showNotification('Invalid password!', 'error');
                    }
                } else {
                    showNotification('User not found!', 'error');
                }
            });
        }

        // Function to show the app screen
        function showAppScreen(user) {
            if (!user || !user.name) {
                showNotification('User data is invalid. Please log in again.', 'error');
                return;
            }
            currentUser = user;
            authScreen.style.display = 'none';
            appScreen.style.display = 'flex';
            const initial = user.name.charAt(0).toUpperCase();
            userAvatar.textContent = initial;
            userName.textContent = user.name;
            profileAvatar.textContent = initial;
            profileName.textContent = user.name;
            profileEmail.textContent = user.email;
            loadAllUsers();
            loadUserLikes(user.id);
            loadPosts();
            loadUserDescription(user.id);
            
            // Update user status to online
            const userRef = database.ref('users/' + user.id);
            userRef.update({
                status: 'online',
                lastSeen: firebase.database.ServerValue.TIMESTAMP
            });
        }

        // Function to load user description
        function loadUserDescription(userId) {
            const userRef = database.ref('users/' + userId);
            userRef.once('value', snapshot => {
                const userData = snapshot.val();
                if (userData && userData.description !== undefined) {
                    userDescription = userData.description;
                    userDescriptionContent.textContent = userData.description || 'No description added yet.';
                    if (document.getElementById('userProfileContent').style.display === 'block') {
                        userProfileDescription.textContent = userData.description || 'No description added yet.';
                    }
                }
            });
        }

        // Function to load all users
        function loadAllUsers() {
            const usersRef = database.ref('users');
            usersRef.on('value', snapshot => {
                const usersData = snapshot.val();
                allUsers = [];
                if (usersData) {
                    Object.keys(usersData).forEach(key => {
                        if (usersData[key] && usersData[key].id !== currentUser.id) {
                            allUsers.push({
                                id: key,
                                ...usersData[key]
                            });
                        }
                    });
                }
            });
        }

        // Function to display search results
        function displaySearchResults(results) {
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-result-item">No users found</div>';
                searchResults.style.display = 'block';
                return;
            }
            searchResults.innerHTML = "";
            results.forEach(user => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div class="search-result-avatar">${user.name.charAt(0).toUpperCase()}</div>
                    <div>${escapeHtml(user.name)} (${escapeHtml(user.email)})</div>
                `;
                resultItem.addEventListener('click', () => {
                    viewUserProfile(user);
                    searchResults.style.display = 'none';
                    searchInput.value = '';
                });
                searchResults.appendChild(resultItem);
            });
            searchResults.style.display = 'block';
        }

        // Function to view user profile
        function viewUserProfile(user) {
            showContentTab('user-profile');
            const initial = user.name.charAt(0).toUpperCase();
            document.getElementById('userProfileAvatar').textContent = initial;
            document.getElementById('userProfileName').textContent = user.name;
            document.getElementById('userProfileEmail').textContent = user.email;
            userProfileDescription.textContent = user.description || 'No description added yet.';
            messageUserBtn.dataset.userId = user.id;
            messageUserBtn.dataset.userName = user.name;
            loadProfileStats(user.id, true);
        }

        // Function to load user likes
        function loadUserLikes(userId) {
            const likesRef = database.ref('likes');
            likesRef.orderByChild('userId').equalTo(userId).once('value', snapshot => {
                userLikes = {};
                if (snapshot.exists()) {
                    snapshot.forEach(childSnapshot => {
                        const like = childSnapshot.val();
                        userLikes[like.postId] = true;
                    });
                }
                if (allPosts.length > 0) {
                    displayPosts(filterPostsByFeed());
                }
            });
        }

        // Function to load posts
        function loadPosts() {
            const postsRef = database.ref('posts');
            postsRef.on('value', snapshot => {
                const postsData = snapshot.val();
                allPosts = [];
                if (postsData) {
                    Object.keys(postsData).forEach(key => {
                        if (postsData[key]) {
                            allPosts.push({
                                id: key,
                                ...postsData[key]
                            });
                        }
                    });
                }
                filterPosts();
                if (document.getElementById('profileContent').style.display === 'block') {
                    loadProfileStats(currentUser.id);
                }
            }, error => {
                console.error("Error reading from database:", error);
                postsList.innerHTML = '<div class="empty-posts">Error loading posts. Please check your connection.</div>';
            });
        }

        // Function to filter posts
        function filterPosts() {
            const filteredPosts = filterPostsByFeed();
            displayPosts(filteredPosts);
        }

        // Function to filter posts by feed
        function filterPostsByFeed() {
            if (!currentUser) return [];
            if (currentFeed === 'my') {
                return allPosts.filter(post => post.userId === currentUser.id);
            } else {
                return allPosts.filter(post =>
                    post.privacy === 'public' ||
                    post.userId === currentUser.id
                );
            }
        }

        // Function to create a post
        function createPost(content, privacy) {
            if (!currentUser) {
                showNotification('You need to be logged in to post!', 'error');
                return;
            }
            const newPost = {
                content: escapeHtml(content),
                userId: currentUser.id,
                userName: currentUser.name,
                date: new Date().toLocaleString(),
                timestamp: Date.now(),
                privacy: privacy,
                likes: 0,
                commentsEnabled: true
            };
            const postsRef = database.ref('posts');
            const newPostRef = postsRef.push();
            newPostRef.set(newPost)
                .then(() => {
                    postContent.value = '';
                    showNotification('Post published successfully!', 'success');
                })
                .catch(error => {
                    console.error("Error adding post:", error);
                    showNotification('Error publishing post. Please try again.', 'error');
                });
        }

        // Function to like a post
        function likePost(postId, currentLikes, buttonElement) {
            if (!currentUser) {
                showNotification('You need to be logged in to like posts!', 'error');
                return;
            }
            const likesRef = database.ref('likes');
            const postLikesRef = database.ref('posts/' + postId + '/likes');
            if (userLikes[postId]) {
                likesRef.orderByChild('userId').equalTo(currentUser.id).once('value', snapshot => {
                    snapshot.forEach(childSnapshot => {
                        const like = childSnapshot.val();
                        if (like.postId === postId) {
                            likesRef.child(childSnapshot.key).remove();
                        }
                    });
                });
                postLikesRef.set(currentLikes - 1);
                userLikes[postId] = false;
                buttonElement.classList.remove('liked');
                buttonElement.querySelector('i').className = 'far fa-heart';
                buttonElement.querySelector('span').textContent = currentLikes - 1;
            } else {
                const newLikeRef = likesRef.push();
                newLikeRef.set({
                    userId: currentUser.id,
                    postId: postId,
                    timestamp: Date.now()
                });
                postLikesRef.set(currentLikes + 1);
                userLikes[postId] = true;
                buttonElement.classList.add('liked');
                buttonElement.querySelector('i').className = 'fas fa-heart';
                buttonElement.querySelector('span').textContent = currentLikes + 1;

                // Add animation
                buttonElement.classList.add('like-animation');
                setTimeout(() => {
                    buttonElement.classList.remove('like-animation');
                }, 500);
            }
        }

        // Function to add a comment
        function addComment(postId, content) {
            if (!currentUser) {
                showNotification('You need to be logged in to comment!', 'error');
                return;
            }
            if (!content.trim()) {
                showNotification('Comment cannot be empty!', 'error');
                return;
            }
            const commentsRef = database.ref('comments');
            const newCommentRef = commentsRef.push();
            newCommentRef.set({
                userId: currentUser.id,
                userName: currentUser.name,
                postId: postId,
                content: escapeHtml(content),
                date: new Date().toLocaleString(),
                timestamp: Date.now()
            })
                .then(() => {
                    showNotification('Comment added successfully!', 'success');
                })
                .catch(error => {
                    console.error("Error adding comment:", error);
                    showNotification('Error adding comment. Please try again.', 'error');
                });
        }

        // Function to delete a comment
        function deleteComment(commentId) {
            if (!confirm('Are you sure you want to delete this comment?')) {
                return;
            }
            const commentRef = database.ref('comments/' + commentId);
            commentRef.remove()
                .then(() => {
                    showNotification('Comment deleted successfully!', 'success');
                })
                .catch(error => {
                    console.error("Error deleting comment:", error);
                    showNotification('Error deleting comment. Please try again.', 'error');
                });
        }

        // Function to toggle comments
        function toggleComments(postId, currentState) {
            const commentsEnabledRef = database.ref('posts/' + postId + '/commentsEnabled');
            commentsEnabledRef.set(!currentState)
                .then(() => {
                    showNotification(
                        currentState ? 'Comments disabled!' : 'Comments enabled!',
                        'success'
                    );
                })
                .catch(error => {
                    console.error("Error toggling comments:", error);
                    showNotification('Error toggling comments. Please try again.', 'error');
                });
        }

        // Function to delete a post
        function deletePost(postId) {
            if (!confirm('Are you sure you want to delete this post?')) {
                return;
            }
            const postRef = database.ref('posts/' + postId);
            postRef.remove()
                .then(() => {
                    showNotification('Post deleted successfully!', 'success');
                    // Also delete associated likes and comments
                    const likesRef = database.ref('likes');
                    likesRef.orderByChild('postId').equalTo(postId).once('value', snapshot => {
                        snapshot.forEach(childSnapshot => {
                            likesRef.child(childSnapshot.key).remove();
                        });
                    });
                    const commentsRef = database.ref('comments');
                    commentsRef.orderByChild('postId').equalTo(postId).once('value', snapshot => {
                        snapshot.forEach(childSnapshot => {
                            commentsRef.child(childSnapshot.key).remove();
                        });
                    });
                })
                .catch(error => {
                    console.error("Error deleting post:", error);
                    showNotification('Error deleting post. Please try again.', 'error');
                });
        }

        // Function to load profile stats
        function loadProfileStats(userId, isOtherUser = false) {
            const user = isOtherUser ? allUsers.find(u => u.id === userId) : currentUser;
            const postsListElement = isOtherUser ?
                document.getElementById('userProfilePostsList') : profilePostsList;
            const statPostsElement = isOtherUser ? document.getElementById('userStatPosts') : statPosts;
            const statLikesElement = isOtherUser ? document.getElementById('userStatLikes') : statLikes;
            const statCommentsElement = isOtherUser ?
                document.getElementById('userStatComments') : statComments;

            if (!user) return;

            const userPosts = allPosts.filter(post => post.userId === userId);
            statPostsElement.textContent = userPosts.length;

            let totalLikes = 0;
            userPosts.forEach(post => {
                totalLikes += post.likes || 0;
            });
            statLikesElement.textContent = totalLikes;

            const commentsRef = database.ref('comments');
            commentsRef.once('value', snapshot => {
                let commentCount = 0;
                if (snapshot.exists()) {
                    snapshot.forEach(childSnapshot => {
                        const comment = childSnapshot.val();
                        if (userPosts.some(post => post.id === comment.postId)) {
                            commentCount++;
                        }
                    });
                }
                statCommentsElement.textContent = commentCount;
            });

            displayProfilePosts(userPosts, isOtherUser);
        }

        // Function to display profile posts
        function displayProfilePosts(posts, isOtherUser = false) {
            const postsListElement = isOtherUser ?
                document.getElementById('userProfilePostsList') : profilePostsList;

            if (!posts || posts.length === 0) {
                postsListElement.innerHTML = '<div class="empty-posts">No posts yet.</div>';
                return;
            }

            posts.sort((a, b) => b.timestamp - a.timestamp);
            postsListElement.innerHTML = '';

            posts.forEach(post => {
                if (!post) return;
                const isOwner = currentUser && post.userId === currentUser.id;
                const isLiked = userLikes[post.id] || false;

                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <div class="post-header">
                        <div class="post-user-avatar" data-user-id="${post.userId}">${post.userName ?
                    post.userName.charAt(0).toUpperCase() : 'U'}</div>
                        <div class="post-username" data-user-id="${post.userId}">${escapeHtml(post.userName || 'Unknown User')}</div>
                        <div class="post-date"><i class="far fa-clock"></i>${post.date || 'Unknown date'}</div>
                    </div>
                    <div class="post-content">${escapeHtml(post.content || '')}</div>
                    <div class="post-footer">
                        <div class="post-actions">
                            <button class="post-action${isLiked ? ' liked' : ''}" data-post-id="${post.id}" data-likes="${post.likes || 0}">
                                <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                                <span>${post.likes || 0}</span>
                            </button>
                            <button class="post-action" data-post-id="${post.id}">
                                <i class="far fa-comment"></i> Comment
                            </button>
                            <button class="message-icon" data-user-id="${post.userId}">
                                <i class="fas fa-envelope"></i>
                            </button>
                        </div>
                        <div class="post-privacy">
                            <i class="fas${post.privacy === 'private' ? 'fa-lock' : 'fa-globe'}"></i>
                            ${post.privacy === 'private' ? 'Private' : 'Public'}
                        </div>
                    </div>
                    ${isOwner ? `
                        <div class="post-owner-actions">
                            <button class="owner-btn edit-btn" data-post-id="${post.id}">Edit</button>
                            <button class="owner-btn delete-btn" data-post-id="${post.id}">Delete</button>
                            <button class="owner-btn" data-post-id="${post.id}" data-comments-enabled="${post.commentsEnabled !== false}">
                                ${post.commentsEnabled !== false ? 'Disable Comments' : 'Enable Comments'}
                            </button>
                        </div>
                    ` : ''}
                    <div class="comments-section">
                        <button class="comments-toggle" data-post-id="${post.id}">
                            <i class="fas fa-chevron-down"></i> Show Comments
                        </button>
                        <div class="comment-form"${post.commentsEnabled === false ? ' style="display: none;"' : ''}>
                            <input type="text" class="comment-input" placeholder="Write a comment..." data-post-id="${post.id}">
                            <button class="comment-submit" data-post-id="${post.id}">Post</button>
                        </div>
                        <div class="comments-list" id="comments-${post.id}"></div>
                    </div>
                `;
                postsListElement.appendChild(postElement);
            });
            attachPostEventListeners(isOtherUser);
            loadCommentsForPosts(posts.map(post => post.id));
        }

        // Enhanced openChat function
        function openChat(user, chatType = 'inline') {
            currentChatUser = user;
            currentChatType = chatType;

            if (chatType === 'inline') {
                document.getElementById('messagesContent').style.display = 'none';
                document.getElementById('chatContent').style.display = 'block';
                chatUserAvatar.textContent = user.userName.charAt(0).toUpperCase();
                chatUserName.textContent = user.userName;
                
                // Update user status in UI
                const userStatusRef = database.ref('users/' + user.userId + '/status');
                userStatusRef.once('value', snapshot => {
                    const status = snapshot.val();
                    chatUserStatus.textContent = status === 'online' ? 'Online' : 'Offline';
                    chatUserStatus.style.color = status === 'online' ? '#2ecc71' : '#e74c3c';
                });
                
                messageInput.disabled = false;
                messageSend.disabled = true;
                loadMessages(user.userId);

                // Navigate to chat tab
                showContentTab('chat');
                document.querySelector('.content-tab[data-content="chat"]').click();
            } else {
                // Full screen chat
                fullScreenChatUserAvatar.textContent = user.userName.charAt(0).toUpperCase();
                fullScreenChatUserName.textContent = user.userName;
                
                // Update user status in UI
                const userStatusRef = database.ref('users/' + user.userId + '/status');
                userStatusRef.once('value', snapshot => {
                    const status = snapshot.val();
                    fullScreenChatUserStatus.textContent = status === 'online' ? 'Online' : 'Offline';
                    fullScreenChatUserStatus.style.color = status === 'online' ? '#2ecc71' : '#e74c3c';
                });
                
                fullScreenMessageInput.disabled = false;
                fullScreenMessageSend.disabled = true;
                fullScreenChat.classList.add('active');
                loadFullScreenMessages(user.userId);
            }
        }

        // Function to close chat
        function closeChat() {
            document.getElementById('chatContent').style.display = 'none';
            document.getElementById('messagesContent').style.display = 'block';
            currentChatUser = null;
        }

        // Function to close full screen chat
        function closeFullScreenChat() {
            fullScreenChat.classList.remove('active');
            currentChatUser = null;
        }

        // Enhanced function to load conversations with unread count
        function loadConversations() {
            if (!currentUser) return;

            const messagesRef = database.ref('messages');
            messagesRef.once('value').then(snapshot => {
                const messagesData = snapshot.val();
                conversations = {};
                const unreadCounts = {};

                if (messagesData) {
                    Object.keys(messagesData).forEach(key => {
                        const message = messagesData[key];
                        if (message.senderId === currentUser.id || message.receiverId === currentUser.id) {
                            const otherUserId = message.senderId === currentUser.id ?
                                message.receiverId : message.senderId;
                            const otherUserName = message.senderId === currentUser.id ?
                                message.receiverName : message.senderName;

                            if (!conversations[otherUserId]) {
                                conversations[otherUserId] = {
                                    userId: otherUserId,
                                    userName: otherUserName,
                                    lastMessage: message.content,
                                    lastMessageTime: message.timestamp,
                                    unread: 0
                                };
                            } else {
                                if (message.timestamp > conversations[otherUserId].lastMessageTime) {
                                    conversations[otherUserId].lastMessage = message.content;
                                    conversations[otherUserId].lastMessageTime = message.timestamp;
                                }
                            }

                            // Count unread messages
                            if (!message.read && message.receiverId === currentUser.id) {
                                if (!unreadCounts[otherUserId]) {
                                    unreadCounts[otherUserId] = 0;
                                }
                                unreadCounts[otherUserId] += 1;
                                conversations[otherUserId].unread = unreadCounts[otherUserId];
                            }
                        }
                    });
                }
                displayConversations();
            }).catch(error => {
                console.error("Error loading conversations:", error);
                showNotification('Error loading conversations. Please try again.', 'error');
            });
        }

        // Enhanced function to display conversations with unread badges
        function displayConversations() {
            const conversationArray = Object.values(conversations);

            if (conversationArray.length === 0) {
                conversationList.innerHTML = '<div class="empty-posts">No conversations yet. Start a conversation by messaging another user.</div>';
                return;
            }

            conversationArray.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
            conversationList.innerHTML = "";
            conversationArray.forEach(conversation => {
                const conversationItem = document.createElement('div');
                conversationItem.className = 'conversation-item';
                if (currentChatUser && currentChatUser.userId === conversation.userId) {
                    conversationItem.classList.add('active');
                }
                if (conversation.unread > 0) {
                    conversationItem.classList.add('unread');
                }
                conversationItem.innerHTML = `
                    <div class="conversation-avatar">${conversation.userName.charAt(0).toUpperCase()}</div>
                    <div class="conversation-info">
                        <div class="conversation-name">${escapeHtml(conversation.userName)}</div>
                        <div class="conversation-preview">${escapeHtml(conversation.lastMessage)}</div>
                        <div class="conversation-time">${formatTime(conversation.lastMessageTime)}</div>
                    </div>
                    ${conversation.unread > 0 ? `<div class="conversation-badge">${conversation.unread}</div>` : ''}
                `;
                conversationItem.addEventListener('click', () => {
                    openChat(conversation, 'inline');
                });
                conversationList.appendChild(conversationItem);
            });
        }

        // Enhanced function to load messages
        function loadMessages(userId) {
            if (!currentUser) return;

            // Clear placeholder
            chatMessages.innerHTML = '';
            const messagesRef = database.ref('messages');
            messagesRef.orderByChild('timestamp').once('value').then(snapshot => {
                const messagesData = snapshot.val();
                const messages = [];

                if (messagesData) {
                    Object.keys(messagesData).forEach(key => {
                        const message = messagesData[key];
                        if ((message.senderId === currentUser.id && message.receiverId === userId) ||
                            (message.senderId === userId && message.receiverId === currentUser.id)) {
                            messages.push({
                                id: key,
                                ...message
                            });

                            // Mark as read if receiver is current user
                            if (message.receiverId === currentUser.id && !message.read) {
                                messagesRef.child(key).update({
                                    read: true
                                });
                            }
                        }
                    });
                }

                messages.sort((a, b) => a.timestamp - b.timestamp);

                displayMessages(messages);

                // Update conversation list to reflect read status
                loadConversations();
            }).catch(error => {
                console.error("Error loading messages:", error);
                showNotification('Error loading messages. Please try again.', 'error');
            });
        }

        // Enhanced function to load full screen messages
        function loadFullScreenMessages(userId) {
            if (!currentUser) return;

            const messagesRef = database.ref('messages');
            messagesRef.orderByChild('timestamp').once('value').then(snapshot => {
                const messagesData = snapshot.val();
                const messages = [];

                if (messagesData) {
                    Object.keys(messagesData).forEach(key => {
                        const message = messagesData[key];
                        if ((message.senderId === currentUser.id && message.receiverId === userId) ||
                            (message.senderId === userId && message.receiverId === currentUser.id)) {
                            messages.push({
                                id: key,
                                ...message
                            });
                            // Mark as read if receiver is current user
                            if (message.receiverId === currentUser.id && !message.read) {
                                messagesRef.child(key).update({
                                    read: true
                                });
                            }
                        }
                    });
                }

                messages.sort((a, b) => a.timestamp - b.timestamp);
                displayFullScreenMessages(messages);

                // Update conversation list to reflect read status
                loadConversations();
            }).catch(error => {
                console.error("Error loading messages:", error);
                showNotification('Error loading messages. Please try again.', 'error');
            });
        }

        // Function to display messages with enhanced styling
        function displayMessages(messages) {
            chatMessages.innerHTML = '';
            if (messages.length === 0) {
                chatMessages.innerHTML = '<div class="empty-posts">No messages yet. Start a conversation!</div>';
                return;
            }

            messages.forEach(message => {
                const messageElement = document.createElement('div');
                const isSent = message.senderId === currentUser.id;
                const messageTime = new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                messageElement.className = `message ${isSent ? 'sent' : 'received'}`;
                messageElement.dataset.messageId = message.id;

                messageElement.innerHTML = `
                    <div class="message-content">${escapeHtml(message.content)}</div>
                    <div class="message-meta">
                        <span class="message-time">${messageTime}</span>
                        ${isSent ? '<span class="message-status">' + (message.read ? 'Read' : 'Sent') + '</span>' : ''}
                    </div>
                    ${isSent ? `
                        <div class="message-actions">
                            <button class="message-action-btn edit" data-message-id="${message.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="message-action-btn delete" data-message-id="${message.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    ` : ''}
                `;
                chatMessages.appendChild(messageElement);

                // Add event listeners for message actions
                if (isSent) {
                    const editBtn = messageElement.querySelector('.message-action-btn.edit');
                    const deleteBtn = messageElement.querySelector('.message-action-btn.delete');
                    editBtn.addEventListener('click', () => editMessage(message.id, message.content));
                    deleteBtn.addEventListener('click', () => deleteMessage(message.id));
                }
            });

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Function to display full screen messages with enhanced styling
        function displayFullScreenMessages(messages) {
            fullScreenChatMessages.innerHTML = "";
            if (messages.length === 0) {
                fullScreenChatMessages.innerHTML = '<div class="empty-posts">No messages yet. Start a conversation!</div>';
                return;
            }

            messages.forEach(message => {
                const messageElement = document.createElement('div');
                const isSent = message.senderId === currentUser.id;
                const messageTime = new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                messageElement.className = `message ${isSent ? 'sent' : 'received'}`;
                messageElement.dataset.messageId = message.id;

                messageElement.innerHTML = `
                    <div class="message-content">${escapeHtml(message.content)}</div>
                    <div class="message-meta">
                        <span class="message-time">${messageTime}</span>
                        ${isSent ? '<span class="message-status">' + (message.read ? 'Read' : 'Sent') + '</span>' : ''}
                    </div>
                    ${isSent ? `
                        <div class="message-actions">
                            <button class="message-action-btn edit" data-message-id="${message.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="message-action-btn delete" data-message-id="${message.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    ` : ''}
                `;
                fullScreenChatMessages.appendChild(messageElement);

                // Add event listeners for message actions
                if (isSent) {
                    const editBtn = messageElement.querySelector('.message-action-btn.edit');
                    const deleteBtn = messageElement.querySelector('.message-action-btn.delete');
                    editBtn.addEventListener('click', () => editFullScreenMessage(message.id, message.content));
                    deleteBtn.addEventListener('click', () => deleteFullScreenMessage(message.id));
                }
            });

            // Scroll to bottom
            fullScreenChatMessages.scrollTop = fullScreenChatMessages.scrollHeight;
        }

        // Function to edit a message
        function editMessage(messageId, content) {
            editingMessageId = messageId;
            messageInput.value = content;
            messageSend.innerHTML = '<i class="fas fa-sync-alt"></i>';
            showNotification('Editing message...', 'success');
        }

        // Function to edit a full screen message
        function editFullScreenMessage(messageId, content) {
            editingMessageId = messageId;
            fullScreenMessageInput.value = content;
            fullScreenMessageSend.innerHTML = '<i class="fas fa-sync-alt"></i>';
            showNotification('Editing message...', 'success');
        }

        // Function to delete a message
        function deleteMessage(messageId) {
            if (!confirm('Are you sure you want to delete this message?')) {
                return;
            }

            const messageRef = database.ref('messages/' + messageId);
            messageRef.remove()
                .then(() => {
                    showNotification('Message deleted successfully!', 'success');
                    if (currentChatUser) {
                        loadMessages(currentChatUser.userId);
                    }
                })
                .catch(error => {
                    console.error("Error deleting message:", error);
                    showNotification('Error deleting message. Please try again.', 'error');
                });
        }

        // Function to delete a full screen message
        function deleteFullScreenMessage(messageId) {
            if (!confirm('Are you sure you want to delete this message?')) {
                return;
            }

            const messageRef = database.ref('messages/' + messageId);
            messageRef.remove()
                .then(() => {
                    showNotification('Message deleted successfully!', 'success');
                    if (currentChatUser) {
                        loadFullScreenMessages(currentChatUser.userId);
                    }
                })
                .catch(error => {
                    console.error("Error deleting message:", error);
                    showNotification('Error deleting message. Please try again.', 'error');
                });
        }

        // Enhanced function to send message
        function sendMessage() {
            const content = messageInput.value.trim();
            if (!content || !currentUser || !currentChatUser) return;

            if (editingMessageId) {
                // Update existing message
                const messageRef = database.ref('messages/' + editingMessageId);
                messageRef.update({
                        content: escapeHtml(content),
                        edited: true,
                        editedAt: Date.now()
                    })
                    .then(() => {
                        messageInput.value = "";
                        editingMessageId = null;
                        messageSend.innerHTML = '<i class="fas fa-paper-plane"></i>';
                        messageSend.disabled = true;
                        showNotification('Message updated!', 'success');
                        loadMessages(currentChatUser.userId);
                    })
                    .catch(error => {
                        console.error("Error updating message:", error);
                        showNotification('Error updating message. Please try again.', 'error');
                    });
            } else {
                // Send new message
                const messagesRef = database.ref('messages');
                const newMessageRef = messagesRef.push();
                newMessageRef.set({
                        senderId: currentUser.id,
                        senderName: currentUser.name,
                        receiverId: currentChatUser.userId,
                        receiverName: currentChatUser.userName,
                        content: escapeHtml(content),
                        timestamp: Date.now(),
                        read: false
                    })
                    .then(() => {
                        messageInput.value = "";
                        messageSend.disabled = true;
                        showNotification('Message sent!', 'success');
                        loadMessages(currentChatUser.userId);

                        // Update conversations list
                        loadConversations();
                    })
                    .catch(error => {
                        console.error("Error sending message:", error);
                        showNotification('Error sending message. Please try again.', 'error');
                    });
            }
        }

        // Enhanced function to send full screen message
        function sendFullScreenMessage() {
            const content = fullScreenMessageInput.value.trim();
            if (!content || !currentUser || !currentChatUser) return;

            if (editingMessageId) {
                // Update existing message
                const messageRef = database.ref('messages/' + editingMessageId);
                messageRef.update({
                        content: escapeHtml(content),
                        edited: true,
                        editedAt: Date.now()
                    })
                    .then(() => {
                        fullScreenMessageInput.value = "";
                        editingMessageId = null;
                        fullScreenMessageSend.innerHTML = '<i class="fas fa-paper-plane"></i>';
                        fullScreenMessageSend.disabled = true;
                        showNotification('Message updated!', 'success');
                        loadFullScreenMessages(currentChatUser.userId);
                    })
                    .catch(error => {
                        console.error("Error updating message:", error);
                        showNotification('Error updating message. Please try again.', 'error');
                    });
            } else {
                // Send new message
                const messagesRef = database.ref('messages');
                const newMessageRef = messagesRef.push();
                newMessageRef.set({
                        senderId: currentUser.id,
                        senderName: currentUser.name,
                        receiverId: currentChatUser.userId,
                        receiverName: currentChatUser.userName,
                        content: escapeHtml(content),
                        timestamp: Date.now(),
                        read: false
                    })
                    .then(() => {
                        fullScreenMessageInput.value = "";
                        fullScreenMessageSend.disabled = true;
                        showNotification('Message sent!', 'success');
                        loadFullScreenMessages(currentChatUser.userId);

                        // Update conversations list
                        loadConversations();
                    })
                    .catch(error => {
                        console.error("Error sending message:", error);
                        showNotification('Error sending message. Please try again.', 'error');
                    });
            }
        }

        // Function to format time
        function formatTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;
            const oneDay = 24 * 60 * 60 * 1000;
            if (diff < oneDay) {
                return date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } else {
                return date.toLocaleDateString();
            }
        }

        // Function to display posts
        function displayPosts(posts) {
            if (!posts || posts.length === 0) {
                postsList.innerHTML = '<div class="empty-posts">No posts yet. Share your first thought!</div>';
                return;
            }

            posts.sort((a, b) => b.timestamp - a.timestamp);
            postsList.innerHTML = "";

            posts.forEach(post => {
                if (!post) return;
                const isOwner = currentUser && post.userId === currentUser.id;
                const isLiked = userLikes[post.id] || false;

                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <div class="post-header">
                        <div class="post-user-avatar" data-user-id="${post.userId}">${post.userName ?
                    post.userName.charAt(0).toUpperCase() : 'U'}</div>
                        <div class="post-username" data-user-id="${post.userId}">${escapeHtml(post.userName || 'Unknown User')}</div>
                        <div class="post-date"><i class="far fa-clock"></i>${post.date || 'Unknown date'}</div>
                    </div>
                    <div class="post-content">${escapeHtml(post.content || '')}</div>
                    <div class="post-footer">
                        <div class="post-actions">
                            <button class="post-action${isLiked ? ' liked' : ''}" data-post-id="${post.id}" data-likes="${post.likes || 0}">
                                <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                                <span>${post.likes || 0}</span>
                            </button>
                            <button class="post-action" data-post-id="${post.id}">
                                <i class="far fa-comment"></i> Comment
                            </button>
                            <button class="message-icon" data-user-id="${post.userId}">
                                <i class="fas fa-envelope"></i>
                            </button>
                        </div>
                        <div class="post-privacy">
                            <i class="fas${post.privacy === 'private' ? 'fa-lock' : 'fa-globe'}"></i>
                            ${post.privacy === 'private' ? 'Private' : 'Public'}
                        </div>
                    </div>
                    ${isOwner ? `
                        <div class="post-owner-actions">
                            <button class="owner-btn edit-btn" data-post-id="${post.id}">Edit</button>
                            <button class="owner-btn delete-btn" data-post-id="${post.id}">Delete</button>
                            <button class="owner-btn" data-post-id="${post.id}" data-comments-enabled="${post.commentsEnabled !== false}">
                                ${post.commentsEnabled !== false ? 'Disable Comments' : 'Enable Comments'}
                            </button>
                        </div>
                    ` : ''}
                    <div class="comments-section">
                        <button class="comments-toggle" data-post-id="${post.id}">
                            <i class="fas fa-chevron-down"></i> Show Comments
                        </button>
                        <div class="comment-form"${post.commentsEnabled === false ? ' style="display: none;"' : ''}>
                            <input type="text" class="comment-input" placeholder="Write a comment..." data-post-id="${post.id}">
                            <button class="comment-submit" data-post-id="${post.id}">Post</button>
                        </div>
                        <div class="comments-list" id="comments-${post.id}"></div>
                    </div>
                `;
                postsList.appendChild(postElement);
            });

            attachPostEventListeners();
            loadCommentsForPosts(posts.map(post => post.id));
        }

        // Function to attach post event listeners
        function attachPostEventListeners(isOtherUser = false) {
            document.querySelectorAll('.post-action:first-child').forEach(btn => {
                btn.addEventListener('click', function () {
                    const postId = this.dataset.postId;
                    const currentLikes = parseInt(this.dataset.likes) || 0;
                    likePost(postId, currentLikes, this);
                });
            });

            document.querySelectorAll('.post-action:not(:first-child)').forEach(btn => {
                btn.addEventListener('click', function () {
                    const postId = this.dataset.postId;
                    const commentInput = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
                    if (commentInput && !commentInput.parentElement.hasAttribute('style')) {
                        commentInput.focus();
                    }
                });
            });

            document.querySelectorAll('.comment-submit').forEach(btn => {
                btn.addEventListener('click', function () {
                    const postId = this.dataset.postId;
                    const commentInput = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
                    addComment(postId, commentInput.value);
                    commentInput.value = "";
                });
            });

            document.querySelectorAll('.comments-toggle').forEach(btn => {
                btn.addEventListener('click', function () {
                    const postId = this.dataset.postId;
                    const commentsList = document.getElementById(`comments-${postId}`);
                    const icon = this.querySelector('i');
                    if (commentsList.classList.contains('show')) {
                        commentsList.classList.remove('show');
                        icon.className = 'fas fa-chevron-down';
                        this.innerHTML = '<i class="fas fa-chevron-down"></i> Show Comments';
                    } else {
                        commentsList.classList.add('show');
                        icon.className = 'fas fa-chevron-up';
                        this.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Comments';
                    }
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const postId = this.dataset.postId;
                    deletePost(postId);
                });
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const postId = this.dataset.postId;
                    const post = allPosts.find(p => p.id === postId);
                    if (post) {
                        postContent.value = post.content;
                        const privacyRadio = document.querySelector(`input[name="privacy"][value="${post.privacy}"]`);
                        if (privacyRadio) privacyRadio.checked = true;
                        postContent.focus();
                        showNotification('Edit your post. Click Post when done.', 'success');
                    }
                });
            });

            document.querySelectorAll('.owner-btn:not(.edit-btn):not(.delete-btn)').forEach(btn => {
                btn.addEventListener('click', function () {
                    const postId = this.dataset.postId;
                    const currentState = this.dataset.commentsEnabled === 'true';
                    toggleComments(postId, currentState);
                });
            });

            document.querySelectorAll('.post-username,.post-user-avatar').forEach(element => {
                element.addEventListener('click', function () {
                    const userId = this.dataset.userId;
                    const user = allUsers.find(u => u.id === userId) || currentUser;
                    if (user) {
                        if (user.id === currentUser.id) {
                            showContentTab('my-posts');
                            loadProfileStats(user.id);
                        } else {
                            viewUserProfile(user);
                        }
                    }
                });
            });

            // Message icon event listeners
            document.querySelectorAll('.message-icon').forEach(icon => {
                icon.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const userId = this.dataset.userId;
                    const user = allUsers.find(u => u.id === userId);
                    if (user) {
                        openChat(user, 'fullscreen');
                    }
                });
            });
        }

        // Function to load comments for posts
        function loadCommentsForPosts(postIds) {
            const commentsRef = database.ref('comments');
            commentsRef.on('value', snapshot => {
                const commentsData = snapshot.val();
                const comments = {};
                postIds.forEach(id => {
                    comments[id] = [];
                });
                if (commentsData) {
                    Object.keys(commentsData).forEach(key => {
                        const comment = commentsData[key];
                        if (comment && postIds.includes(comment.postId)) {
                            comments[comment.postId].push({
                                id: key,
                                ...comment
                            });
                        }
                    });
                }
                Object.keys(comments).forEach(postId => {
                    displayComments(postId, comments[postId]);
                });
            });
        }

        // Function to display comments
        function displayComments(postId, comments) {
            const commentsList = document.getElementById(`comments-${postId}`);
            if (!commentsList) return;
            if (!comments || comments.length === 0) {
                commentsList.innerHTML = '<div class="empty-comments">No comments yet.</div>';
                return;
            }
            comments.sort((a, b) => a.timestamp - b.timestamp);
            commentsList.innerHTML = "";

            comments.forEach(comment => {
                if (!comment) return;
                const isOwner = currentUser && comment.userId === currentUser.id;
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <div class="comment-header">
                        <div class="comment-user" data-user-id="${comment.userId}">${escapeHtml(comment.userName || 'Unknown User')}</div>
                        <div class="comment-date">${comment.date || 'Unknown date'}</div>
                        ${isOwner ? `
                            <div class="comment-actions">
                                <button class="delete-comment" data-comment-id="${comment.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    <div class="comment-content">${escapeHtml(comment.content || '')}</div>
                `;
                commentsList.appendChild(commentElement);
                if (isOwner) {
                    const deleteBtn = commentElement.querySelector('.delete-comment');
                    deleteBtn.addEventListener('click', function () {
                        deleteComment(comment.id);
                    });
                }
                const commentUser = commentElement.querySelector('.comment-user');
                commentUser.addEventListener('click', function () {
                    const userId = this.dataset.userId;
                    const user = allUsers.find(u => u.id === userId) || currentUser;
                    if (user) {
                        if (user.id === currentUser.id) {
                            showContentTab('my-posts');
                            loadProfileStats(user.id);
                        } else {
                            viewUserProfile(user);
                        }
                    }
                });
            });
        }

        // Function to escape HTML to prevent XSS
        function escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    