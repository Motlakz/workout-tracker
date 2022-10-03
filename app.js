export default class WorkoutTracker {
static LOCAL_STORAGE_DATA_KEY = "workout-tracker-entries";

    constructor(root) {
        this.root = root;
        this.root.insertAdjacentHTML("afterbegin", WorkoutTracker.html());
        this.entries = [];

        this.loadEntries(); //load from local storage
        this.updateView(); // get entries and update HTML Table to display them to the user

        this.root.querySelector(".tracker-add").addEventListener("click", () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = (date.getDay() + 1).toString().padStart(2, "0");

            this.addEntry({
                date: `${year}-${month}-${day}`,
                workout: "walking",
                duration: 30
            });
        });
    }
    static html() {
        return `<table class="tracker">
        <thead>
            <tr>
                <th>Date</th>
                <th>Workout</th>
                <th>Duration</th>
                <th></th>
            </tr>
        </thead>
        <tbody class="tracker-entries">
        </tbody>
        <tbody><tr class="tracker-row tracker-row-add">
            <td colspan="4">
                <button type="button" class="tracker-add">Add Entry &plus;</button>
            </td>
        </tr>
        </tbody>
    </table>`;
    }

    static rowHtml() {
        return `<tr class="tracker-row">
        <td>
            <input type="date" class="tracker-date">
        </td>
        <td>
            <select name="" id="" class="tracker-workout">
                <option value="walking">Walking</option>
                <option value="running">Running</option>
                <option value="outdoor-cycling">Outdoor-cycling</option>
                <option value="indoor-cycling">Indoor-cycling</option>
                <option value="swimming">Swimming</option>
                <option value="yoga">Yoga</option>
            </select>
        </td>
        <td>
            <input type="number" class="tracker-duration">
            <span class="tracker-text">minutes</span>
        </td>
        <td>
            <button type="button" class="tracker-button">&times;</button>
        </td>
    </tr>`;
    }

    loadEntries() {
        this.entries = JSON.parse(localStorage.getItem(WorkoutTracker.LOCAL_STORAGE_DATA_KEY)  || "[]"); // Keeps code free from repetition
    }
    saveEntries() {
        localStorage.setItem("workout-tracker-entries", JSON.stringify(this.entries));
    }
    updateView() {
       const tableBody = this.root.querySelector(".tracker-entries");
       const addRow = data => {
            const template =document.createElement("template");// need template to inject the HTML to give us reference to the deleted table row element itself inside the JS
            let row = null;

            template.innerHTML = WorkoutTracker.rowHtml().trim();
            row = template.content.firstElementChild;
            row.querySelector(".tracker-date").value = data.date;
            row.querySelector(".tracker-workout").value = data.workout;
            row.querySelector(".tracker-duration").value = data.duration; // all values here are ones outlined in the HTML option tag - have to match exactly (lowercase HTML = lowercase JS)

            //TODO: add events for input changing + add events to delete the row
            row.querySelector(".tracker-date").addEventListener("change", ({target}) => {
                data.date = target.value; // reference to the object within entries
                this.saveEntries();
            });
            row.querySelector(".tracker-workout").addEventListener("change", ({target}) => {
                data.date = target.value; 
                this.saveEntries();
            });
            row.querySelector(".tracker-duration").addEventListener("change", ({target}) => {
                data.date = target.value;
                this.saveEntries();
            });

            row.querySelector(".tracker-button").addEventListener("click", () => {
                this.deleteEntry(data);
            });

            tableBody.appendChild(row);
       };

       tableBody.querySelectorAll(".tracker-row").forEach(row => {
        row.remove();
       });

       this.entries.forEach(data => addRow(data));
    }
    addEntry(data) { // Data = object of a single workout entry
        this.entries.push(data);
        this.saveEntries();
        this.updateView(); 
    }
    deleteEntry(dataToDelete) {
        this.entries = this.entries.filter(data => data !== dataToDelete); // It's going to keep all data that doesn't need deleting
        this.saveEntries();
        this.updateView();
    }   
}