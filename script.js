let habits = [];

const form = document.getElementById("habitForm");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
        document.getElementById("habitName").value;

    const target =
        document.getElementById("targetDays").value;

    const category =
        document.getElementById("category").value;

    const error =
        validateForm(name, target, category);

    if (error !== "") {

        document.getElementById("errorMessage")
            .textContent = error;

        return;
    }

    document.getElementById("errorMessage")
        .textContent = "";

    addHabit(name, target, category);

    form.reset();
});

function validateForm(name, target, category) {

    if (name.trim().length < 3) {
        return "Habit name must be at least 3 characters.";
    }

    if (
        target < 1 ||
        target > 7 ||
        !Number.isInteger(Number(target))
    ) {
        return "Target must be a whole number between 1 and 7.";
    }

    if (category === "") {
        return "Please select a category.";
    }

    return "";
}

function addHabit(name, target, category) {

    const habit = {

        id: Date.now(),

        name: name,

        category: category,

        target: Number(target),

        streak: 0,

        doneToday: false
    };

    habits.push(habit);

    renderHabits();

    updateSummary();
}

function renderHabits() {

    const container =
        document.getElementById("habitContainer");

    container.innerHTML = "";

    habits.forEach(function (habit) {

        const card =
            document.createElement("div");

        card.classList.add("habit-card");

        if (habit.doneToday) {
            card.classList.add("completed");
        }

        card.innerHTML = `
            <h3>${habit.name}</h3>

            <p>Category: ${habit.category}</p>

            <p>Target Days: ${habit.target}</p>

            <p>Current Streak: ${habit.streak}</p>

            <label>
                Done Today
                <input type="checkbox"
                ${habit.doneToday ? "checked" : ""}>
            </label>

            <br><br>

            <button>Delete</button>
        `;

        const checkbox =
            card.querySelector("input");

        checkbox.addEventListener("change", function () {

            if (this.checked) {

                habit.doneToday = true;
                habit.streak++;

            } else {

                habit.doneToday = false;

                if (habit.streak > 0) {
                    habit.streak--;
                }
            }

            renderHabits();

            updateSummary();
        });

        const deleteButton =
            card.querySelector("button");

        deleteButton.addEventListener("click", function () {

            deleteHabit(habit.id);

        });

        container.appendChild(card);

    });
}

function deleteHabit(id) {

    habits = habits.filter(function (habit) {

        return habit.id !== id;

    });

    renderHabits();

    updateSummary();
}

function updateSummary() {

    const totalHabits =
        habits.length;

    const completedHabits =
        habits.filter(function (habit) {

            return habit.doneToday;

        }).length;

    let completionRate = 0;

    if (totalHabits > 0) {

        completionRate =
            Math.round(
                (completedHabits / totalHabits) * 100
            );
    }

    document.getElementById("totalHabits")
        .textContent = totalHabits;

    document.getElementById("completedHabits")
        .textContent = completedHabits;

    document.getElementById("completionRate")
        .textContent = completionRate + "%";
}