async function followProcess(user_id) {
    const userData = await getUserData(user_id);
    const followersList = document.getElementById('followersList');
    const followingList = document.getElementById('followingList');
    
    // Update counts
    document.querySelector('.follower-count').textContent = userData.followers.length;
    document.querySelector('.following-count').textContent = userData.following.length;

    // Clear previous lists
    followersList.innerHTML = '';
    followingList.innerHTML = '';

    // Add followers to the list
    for (const follower_id of userData.followers) {
        const follow_data = await getUserData(follower_id);
        const follow_status = userData.following.includes(follower_id) ? 'Đang theo dõi' : 'Theo dõi lại';
        
        const content = `<li class="list-group-item custom-list-item">
            <div class="user-info">
                <img src="${follow_data.avt_url || "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"}" alt="Avatar" class="rounded-circle" style="width: 40px; height: 40px;">
                <div class="user-info-text">
                    <span class="user-name">${follow_data.user_name}</span>
                    <span class="full-name">${follow_data.full_name}</span>
                </div>
            </div>
            <button type="button" class="follow_btn" onclick="followUser(${follow_data.user_id})">${follow_status}</button>
        </li>`;
        followersList.innerHTML += content;
    }

    // Add following to the list
    for (const following_id of userData.following) {
        const follow_data = await getUserData(following_id);
        const content = `<li class="list-group-item custom-list-item">
            <div class="user-info">
                <img src="${follow_data.avt_url || "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"}" alt="Avatar" class="rounded-circle" style="width: 40px; height: 40px;">
                <div class="user-info-text">
                    <span class="user-name">${follow_data.user_name}</span>
                    <span class="full-name">${follow_data.full_name}</span>
                </div>
            </div>
            <button type="button" class="follow_btn" onclick="unFollowUser(${follow_data.user_id})">Hủy theo dõi</button>
        </li>`;
        followingList.innerHTML += content;
    }

    // Add tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}
