import { success } from "@/utils/api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const data = [
        {
          "title": "探索未知的海底世界",
          "description": "这篇文章将带你踏上一场奇妙的海底探险之旅，探索神秘的海洋生物和海底地貌。"
        },
        {
          "title": "未来科技：人工智能的崭新时代",
          "description": "本文介绍了人工智能领域的最新进展，探讨了人工智能在医疗、交通、金融等领域的应用前景。"
        },
        {
          "title": "重返自然：户外运动的益处与乐趣",
          "description": "了解户外运动如徒步旅行、露营和攀岩对身心健康的益处，并探讨在自然中放松身心的重要性。"
        },
        {
          "title": "探索宇宙：星际旅行的梦想与现实",
          "description": "本文探讨了人类对宇宙的探索历程，以及未来可能实现的星际旅行技术和挑战。"
        },
        {
          "title": "美食之旅：世界各地的独特美食",
          "description": "这篇文章带你环游世界，品味来自不同文化的独特美食，感受美食带来的文化交流和人情味。"
        },
        {
          "title": "探索古老的文明：埃及神秘之旅",
          "description": "了解古埃及文明的历史和神秘面纱，探索埃及金字塔、尼罗河和法老王的宫殿。"
        },
        {
          "title": "科技创新：未来城市的面貌",
          "description": "本文探讨了科技创新如何改变未来城市的生活方式、交通系统和城市规划，构建智慧、可持续的城市环境。"
        },
        {
          "title": "走进艺术的世界：当代艺术的多样性",
          "description": "了解当代艺术的多种形式和风格，探讨艺术家们的创作灵感和艺术作品背后的意义。"
        },
        {
          "title": "心灵之旅：冥想与身心健康",
          "description": "本文介绍了冥想对心理健康和身体健康的益处，以及如何通过冥想达到身心平衡和内心宁静。"
        },
        {
          "title": "探索自然奇观：壮丽的瀑布世界",
          "description": "这篇文章带你游览世界各地壮丽的瀑布奇观，感受大自然的鬼斧神工和壮美景观。"
        }
      ]
      
    return success("获取成功！",data)
}