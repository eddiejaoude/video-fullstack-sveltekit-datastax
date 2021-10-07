<script context="module">
    export async function load({ fetch }) {
        const res = await fetch('http://localhost:3000/index.json')
        if (res.ok) {
            const data = await res.json()
            return {
                props: { data }
            }
        }
    }
</script>

<script>
    export let data;
    let name = '';
    let bio = '';
    let avatar = '';
    let url = '';
    let keyword = '';

    async function save() {
        await fetch('/index.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, bio, avatar, url })
        })
        .then((res) => res.json())
        .then((newData) => (data = [newData, ...data]));
    }

    async function del(id) {
        await fetch(`/index.json?id=${id}`, {
            method: 'DELETE'
        })
        .then(() => data = data.filter((d) => d.id !== id));
    }

    async function search() {
        await fetch(`/index.json?keyword=${keyword}`)
        .then((res) => res.json())
        .then((newData) => (data = newData));
    }
</script>

<h1>Welcome to EddieHub</h1>

<form on:submit|preventDefault={search}>
    <div class="input-group mb-3">
        <input type="text" class="form-control" name="keyword" bind:value={keyword} placeholder="Search" />
        <input type="submit" value="Search" class="form-control" />
    </div>
</form>

<form on:submit|preventDefault={save}>
    <div class="input-group mb-3">
        <input type="text" class="form-control" name="name" bind:value={name} placeholder="Name" />
        <input type="text" class="form-control" name="bio" bind:value={bio} placeholder="Bio" />
        <input type="text" class="form-control" name="avatar" bind:value={avatar} placeholder="Avatar url" />
        <input type="text" class="form-control" name="url" bind:value={url} placeholder="Your url" />

        <input type="submit" value="Save" class="form-control" />
    </div>
</form>

{#each data as { id, name, bio, avatar, url}}
    <div class="card" style="width: 18rem; margin: 1rem; float: left;">
        <img src={avatar} class="card-img-to" alt={name} />
        <div class="card-body">
            <h5 class="card-title">{name}</h5>
            <p class="card-text">{bio}</p>
        </div>
        <div class="card-footer text-muted">
            <a href={url} class="btn btn-success">More info</a>
            <div class="btn btn-danger" on:click={del(id)}>Delete</div>
        </div>
    </div>
{/each}

