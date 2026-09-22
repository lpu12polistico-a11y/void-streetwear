const products = [
  {id:1,name:"VOID GREY ZIP",category:"hoodies",label:"HOODIES",price:2890,badge:"DROP 001",type:"hoodie",image:"grey-zip-hoodie.png",desc:"Oversized grey zip hoodie with a relaxed silhouette and understated chest mark."},
  {id:2,name:"VOID GRAPHIC SET",category:"bottoms",label:"SETS",price:3990,badge:"STATEMENT",type:"pants",image:"black-graphic-set.png",desc:"Black oversized hoodie and wide-leg pant concept with high-impact distressed graphics."},
  {id:3,name:"FREE SPIRIT HOODIE",category:"hoodies",label:"HOODIES",price:3190,badge:"EDITORIAL",type:"hoodie",image:"free-spirit-hoodie.png",desc:"Washed black oversized hoodie with expressive script artwork across the back."},
  {id:4,name:"NULL ZIP JACKET",category:"outerwear",label:"OUTERWEAR",price:3490,badge:"LIMITED",type:"jacket",desc:"Structured zip jacket with a clean cropped silhouette and understated VOID hardware."},
  {id:5,name:"STATIC WASH TEE",category:"tees",label:"TEES",price:1690,badge:"NEW",type:"tee",desc:"Garment-washed heavyweight tee with a faded charcoal finish. Each piece varies slightly."},
  {id:6,name:"404 SWEATPANTS",category:"bottoms",label:"BOTTOMS",price:2290,badge:"ONLINE ONLY",type:"pants",desc:"Heavy relaxed sweatpants. Soft enough to rot in bed, structured enough to pretend you have plans."}
];

let cart = JSON.parse(localStorage.getItem("voidCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("voidWishlist") || "[]");
let activeProduct = null;
let selectedSize = "M";

const peso = n => "₱" + n.toLocaleString("en-PH");
const grid = document.getElementById("productGrid");

function renderProducts(filter="all", list=products){
  const shown = list.filter(p => filter==="all" || p.category===filter);
  grid.innerHTML = shown.map(p => `
    <article class="product-card">
      <div class="product-image ${p.image?"real-photo":""}" onclick="openProduct(${p.id})">
        <span class="product-badge">${p.badge}</span>
        <button class="wish ${wishlist.includes(p.id)?"active":""}" onclick="event.stopPropagation();toggleWish(${p.id})">${wishlist.includes(p.id)?"♥":"♡"}</button>
        ${p.image?`<img src="${p.image}" alt="${p.name}">`:`<div class="garment ${p.type}"></div>`}
      </div>
      <div class="product-meta">
        <div><div class="product-name">${p.name}</div><div class="product-category">${p.label} / VOID 001</div></div>
        <div class="product-price">${peso(p.price)}</div>
      </div>
      <button class="quick-add" onclick="openProduct(${p.id})">QUICK ADD +</button>
    </article>`).join("");
  document.getElementById("productTotal").textContent = String(shown.length).padStart(2,"0");
}
renderProducts();

document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active"); renderProducts(btn.dataset.filter);
}));

function toggleWish(id){
  wishlist = wishlist.includes(id) ? wishlist.filter(x=>x!==id) : [...wishlist,id];
  localStorage.setItem("voidWishlist",JSON.stringify(wishlist));
  document.getElementById("wishCount").textContent=wishlist.length;
  renderProducts(document.querySelector(".filter.active").dataset.filter);
}
document.getElementById("wishCount").textContent=wishlist.length;

const overlay=document.getElementById("overlay"), cartDrawer=document.getElementById("cartDrawer");
function openOverlay(){overlay.classList.add("open")}
function closeAll(){overlay.classList.remove("open");cartDrawer.classList.remove("open");document.getElementById("searchModal").classList.remove("open");document.getElementById("productModal").classList.remove("open")}
document.getElementById("cartBtn").onclick=()=>{cartDrawer.classList.add("open");openOverlay()}
document.getElementById("closeCart").onclick=closeAll; overlay.onclick=closeAll;
document.getElementById("emptyShopBtn").onclick=()=>{closeAll();document.getElementById("shop").scrollIntoView()}

function openProduct(id){
  activeProduct=products.find(p=>p.id===id); selectedSize="M";
  document.getElementById("modalCategory").textContent=`VOID 001 / ${activeProduct.label}`;
  document.getElementById("modalName").textContent=activeProduct.name;
  document.getElementById("modalPrice").textContent=peso(activeProduct.price);
  document.getElementById("modalDescription").textContent=activeProduct.desc;
  document.getElementById("modalAddPrice").textContent=peso(activeProduct.price);
  document.getElementById("modalArt").innerHTML=activeProduct.image?`<img src="${activeProduct.image}" alt="${activeProduct.name}" style="width:100%;height:100%;object-fit:cover">`:`<div class="garment ${activeProduct.type}"></div>`;
  document.getElementById("sizes").innerHTML=["S","M","L","XL"].map(s=>`<button class="size ${s==="M"?"selected":""}" onclick="selectSize('${s}',this)">${s}</button>`).join("");
  document.getElementById("productModal").classList.add("open");openOverlay();
}
function selectSize(s,el){selectedSize=s;document.querySelectorAll(".size").forEach(x=>x.classList.remove("selected"));el.classList.add("selected")}
document.getElementById("closeProduct").onclick=closeAll;
document.getElementById("modalAdd").onclick=()=>{
  const found=cart.find(x=>x.id===activeProduct.id&&x.size===selectedSize);
  if(found) found.qty++; else cart.push({id:activeProduct.id,size:selectedSize,qty:1});
  saveCart(); closeAll(); showToast(`${activeProduct.name} ADDED. NICE.`);
};

function saveCart(){localStorage.setItem("voidCart",JSON.stringify(cart));renderCart()}
function renderCart(){
  const count=cart.reduce((a,x)=>a+x.qty,0);
  document.getElementById("cartCount").textContent=count;document.getElementById("drawerCount").textContent=`(${count})`;
  const items=document.getElementById("cartItems"), empty=document.getElementById("emptyCart"), footer=document.getElementById("cartFooter");
  if(!cart.length){items.innerHTML="";empty.style.display="block";footer.style.display="none";return}
  empty.style.display="none";footer.style.display="block";
  let total=0;
  items.innerHTML=cart.map((x,i)=>{const p=products.find(y=>y.id===x.id);total+=p.price*x.qty;return `<div class="cart-item"><div class="cart-thumb">V</div><div><h4>${p.name}</h4><p>SIZE ${x.size} · QTY ${x.qty}</p><p>${peso(p.price*x.qty)}</p></div><button class="remove" onclick="removeCart(${i})">REMOVE</button></div>`}).join("");
  document.getElementById("subtotal").textContent=peso(total);
}
function removeCart(i){cart.splice(i,1);saveCart()}
renderCart();

const searchModal=document.getElementById("searchModal"), searchInput=document.getElementById("searchInput");
document.getElementById("searchBtn").onclick=()=>{searchModal.classList.add("open");openOverlay();setTimeout(()=>searchInput.focus(),150)}
document.getElementById("closeSearch").onclick=closeAll;
searchInput.oninput=()=>{
  const q=searchInput.value.toLowerCase().trim();
  const res=q?products.filter(p=>(p.name+" "+p.label).toLowerCase().includes(q)):[];
  document.getElementById("searchResults").innerHTML=res.map(p=>`<div class="search-result" onclick="closeAll();setTimeout(()=>openProduct(${p.id}),100)"><span>${p.name}</span><span>${peso(p.price)}</span></div>`).join("") || (q?'<div class="search-result"><span>NOTHING. THE VOID IS EMPTY.</span></div>':"");
};

function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
document.getElementById("newsletterForm").onsubmit=e=>{e.preventDefault();showToast("WELCOME TO THE VOID.");e.target.reset()}
document.getElementById("checkoutBtn").onclick=()=>showToast("DEMO CHECKOUT — CONNECT YOUR PAYMENT GATEWAY NEXT.");
document.getElementById("wishlistBtn").onclick=()=>showToast(wishlist.length?`${wishlist.length} PIECE${wishlist.length>1?"S":""} SAVED FOR LATER.`:"YOUR WISHLIST IS EMPTY. COLD.");

document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll()});
