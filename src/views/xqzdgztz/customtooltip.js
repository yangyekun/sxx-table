// 自定义提示组件
class CustomTooltip {
    eGui;

    init(params) {
        let data = params.value.split('<br>');
        const eGui = (this.eGui = document.createElement('div'));
        eGui.classList.add('custom-tooltip');
        eGui.innerHTML = `
               <div style="text-align: center;font-size: 16px"><b>修改记录</b></div>
            ${data.map((item, index) => `<div key="${index}">${item}</div>`).join('')}
        `;
    }

    getGui() {
        return this.eGui;
    }
}

export default CustomTooltip;
