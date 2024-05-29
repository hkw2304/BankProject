package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.example.demo.jpa.SavingsManagerRepo;
import com.example.demo.vo.SavingsManagerVO;

@Controller
public class ProductController {
	
	@Autowired
	SavingsManagerRepo smr;
	ModelAndView mav = new ModelAndView();
	
	@RequestMapping(value="/deposit")
	public ModelAndView deposit() {
		ModelAndView mav = new ModelAndView();
		mav.setViewName("products/deposit");
		return mav;
	}
	@RequestMapping(value="/savings")
	public ModelAndView savings() {
		List<SavingsManagerVO> list = smr.savings_list();
		mav.addObject("list", list);
		mav.setViewName("products/savings");
		return mav;
	}
	
	@RequestMapping(value="detailProduct")
	public ModelAndView detail(@RequestParam(name="savings_num") String num) {
		Optional<SavingsManagerVO> list = smr.findById(num);
		SavingsManagerVO savings = list.get();
		System.out.println(">>>>>>>>>>>>>>>"+savings);
		mav.addObject("savings", savings);
		mav.setViewName("product/detailSavings");
		return mav;
	}
}
