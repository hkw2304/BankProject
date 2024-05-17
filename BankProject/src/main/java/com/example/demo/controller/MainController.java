package com.example.demo.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.example.demo.jpa.ManagerRepo;
import com.example.demo.jpa.MemberRepo;
import com.example.demo.vo.ManagerVO;
import com.example.demo.vo.MemberVO;

import jakarta.servlet.http.HttpSession;

@Controller
public class MainController {
	
	@Autowired
	MemberRepo memberRepo;
	@Autowired
	ManagerRepo managerRepo;
	
	
	@RequestMapping(value="/")
	public ModelAndView index() {
		ModelAndView mav = new ModelAndView();
		mav.setViewName("index");
		return mav;
	}
	@RequestMapping(value="/register")
	public ModelAndView register() {
		ModelAndView mav = new ModelAndView();
		mav.setViewName("member/register");
		return mav;
	}
	@RequestMapping(value="/register_Account")
	public ModelAndView registerAccount(MemberVO member) {
		ModelAndView mav = new ModelAndView();
		memberRepo.save(member);
//		System.out.println("member >> " + member);
		mav.setViewName("index");
		return mav;
	}
	@RequestMapping(value="/manager_Account")
	public ModelAndView manager_Account(ManagerVO manager, HttpSession session) {
		
		ModelAndView mav = new ModelAndView();
		String managerId = manager.getManager_id();
		boolean manager_register_Ck = false;
		
//		System.out.println("manager >> " + manager);
		try {
			managerRepo.save(manager);
			manager_register_Ck = true;
			mav.addObject("manager_register_Ck", manager_register_Ck);
			mav.setViewName("index");
			return mav;
			
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("부모 키가 없습니다.");
			mav.addObject("manager_register_Ck", manager_register_Ck);
			mav.setViewName("index");
			return mav;
		}
	}
	@RequestMapping(value="/login")
	public ModelAndView login() {
		ModelAndView mav = new ModelAndView();
		mav.setViewName("login/login");
		return mav;
	}
	
}