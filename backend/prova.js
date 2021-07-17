const rand_users = (len) => {
    users = []
    for (let i = 0; i < len; i++) {
        a = Math.floor(Math.random() * 10000);
        while (users.includes(a)) {
            a = Math.floor(Math.random() * 10000);
        }
        users.push({"username":a, points:1, old_weights:2});
    }
    return users;
}

const rand_numb_different = () => {
    a = Math.floor(Math.random() * (users.length - 1))
    b = Math.floor(Math.random() * (users.length - 1))
    while (b === a) {
        b = Math.floor(Math.random() * (users.length - 1))
    } 
    return [users[a], users[b]]
}

const arr_contains = (element, array) => {
    for (let el of array) {
        if (el === element) {
            return true;
        }
    }
    return false;
}

const computePoints = (username, relation) => {
    for (user of users) {
        if (user.username === username) {
            console.log("found");
            for (user2 of users){
                if (user2.username === relation.b){
                    other_points = user2.points;
                }
            }
            new_weights = user.old_weights + other_points;
            user.points = user.points * user.old_weights / (new_weights) + other_points * relation.vote / new_weights;
            user.old_weights = new_weights;
            return;
        }
    }
}


users = rand_users(10);
console.log(users)
rel = [];
for (let i = 0; i < 30; i++) {
    numbers = rand_numb_different();
    relation = { "a": numbers[0].username, "b": numbers[1].username, "vote": Math.random() > 0.5 ? 1 : -1};
    
    while (arr_contains(relation, rel)){
        numbers = rand_numb_different();
        relation = { "a": numbers[0].username, "b": numbers[1].username, "vote": Math.random() > 0.5 ? 1 : -1 };
    }
    computePoints(relation.b, relation);
    rel.push(relation);
}
console.log(rel)
console.log(users)



// const algo = ()=>{
//     votes = Array(users.length);
//     votes.fill([0,0]);
//     for (let user of users){
//         idx = users.indexOf(user);
//         for (relation of rel){
//             if (relation.b === user){
//                 votes[idx][0] += 1;
//             }
//             else if (relation.a === user) {
//                 votes[idx][1] += 1;
//             }
//         }
//         console.log(votes[idx])
//         votes[idx] = votes[idx][1] > 0 ? votes[idx][0] / votes[idx][1] : votes[idx][0];
//     }
//     return votes;
// }

// console.log(algo())