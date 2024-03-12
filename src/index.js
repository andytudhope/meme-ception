import { connect } from "https://unpkg.com/@permaweb/aoconnect";

const { dryrun } = connect();

/* For iframe */

async function getWebsite() {
    try {
    const result = await dryrun({
        process: "JF1O362-tW01hpV7Lm3pLeSEBxcFaStQ-wqT4UzhYpw",
        tags: [
        { name: 'Action', value: "Get-Frame" }
        ]
    });
    if (result) {
        return result.Messages[0]
    }
    else
        return "J_6eJSA-NZ8BnmdZVtb3vTTd1_LDVBi4_c4grV7mWGc"
    } catch (e) {
        console.log(e)
        return "J_6eJSA-NZ8BnmdZVtb3vTTd1_LDVBi4_c4grV7mWGc"
    }
}

/* For footer */

async function getVotes() {
    try {
    const result = await dryrun({
        process: "JF1O362-tW01hpV7Lm3pLeSEBxcFaStQ-wqT4UzhYpw",
        tags: [
        { name: 'Action', value: "Get-Votes" }
        ]
    });
    if (result) {
        return JSON.parse(result.Messages[0].Data); 
    }
    else
        return ""
    } catch (e) {
        console.log(e)
        return ""
    }
}


function renderVotes(voteData) {
    const colVotes = document.getElementById('col-votes');

    voteData.forEach((item, index) => {
        const container = document.createElement('div');
        container.classList.add('vote-item');

        const heading = document.createElement('h3');
        heading.textContent = `Candidate #${index}`;
        container.appendChild(heading);

        const link = document.createElement('a');
        link.href = `https://arweave.net/${item.tx}`;
        link.textContent = 'Memeframe URL';
        link.target = "_blank";
        container.appendChild(link);

        const votes = document.createElement('p');
        votes.textContent = `Yay: ${item.yay}, Nay: ${item.nay}`;
        container.appendChild(votes);

        const deadline = new Date(item.deadline * 1000);
        const formattedDate = `${('0' + deadline.getDate()).slice(-2)}-${('0' + (deadline.getMonth() + 1)).slice(-2)}-${deadline.getFullYear()}`;
        const deadlineP = document.createElement('p');
        deadlineP.textContent = `Deadline: ${formattedDate}`;
        container.appendChild(deadlineP);

        colVotes.appendChild(container);
    });
}

async function getCredBalance() {
    try {
    const result = await dryrun({
        process: "Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc",
        tags: [
        { name: 'Action', value: "Balance" }
        ]
    });
    if (result) {
        console.log(result.Messages[0].Data); 
    }
    else
        return 0
    } catch (e) {
        console.log(e)
        return "could not fetch"
    }
}

(async () => {
    let arns = false
    // get process id
    let processId = await fetch(window.location.href).then(res => res.headers.get('x-arns-resolved-id'))
    if (!processId) {
    processId = "JF1O362-tW01hpV7Lm3pLeSEBxcFaStQ-wqT4UzhYpw"
    } else {
    arns = true
    }
    // set the main iframe first
    const processResponse = await getWebsite();

    const url = `https://arweave.net/${processResponse.Data}`

    document.getElementById('iframe').innerHTML = `<iframe style = "border:0;width:100%;height:100%" src = "${url}" />`;

    // now set what appears in the footer
    const voteData = await getVotes()
    renderVotes(voteData)

    getCredBalance()
})();

