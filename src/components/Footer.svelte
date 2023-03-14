<footer>
    <button>
        <img src ="./twitter.svg" alt=""/>
   
    </button>
    <button>
        <img src ="./discord.svg" alt=""/>
        
    </button>
</footer>

<style>
    button {
        width: 50px;
        height: 50px;
        background-color: transparent;
        border: none;
        transition: .02s ease-in-out;
    }
    button:hover {
        transform: scale(1.1);
    }
    img {
        width: 100%;
        height: 100%;
    }
    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        background-color: rgba(0, 0, 0, .5);
        margin: auto;
        position: relative;
        bottom: 0;
        width: 100vw;
       
    }

    h2 {
        color: #fff;
    }
</style>